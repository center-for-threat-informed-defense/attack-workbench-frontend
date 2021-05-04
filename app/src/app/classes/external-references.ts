import { forkJoin, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { RestApiConnectorService } from "../services/connectors/rest-api/rest-api-connector.service";
import { Serializable, ValidationData } from "./serializable";
import { StixObject } from "./stix/stix-object";
import { logger } from "../util/logger";

export class ExternalReferences extends Serializable {
    private _externalReferences : Map<string, ExternalReference> = new Map();
    private _externalReferencesIndex : Map<string, number> = new Map();
    private usedReferences : string[] = [];     // array to store used references
    private missingReferences : string[] = [];  // array to store missing references
    private brokenCitations : string[] = [];    // array to store broken citations

    /**
     * return external references list
     */
    public get externalReferences() { return this._externalReferences; }

    /**
     * Return list of external references in order
     */
    public list() : Array<[number, ExternalReference]> {
        let externalRefList : Array<[number, ExternalReference]> = [];

        for (let [key, value] of this._externalReferencesIndex) {
            if (this.getReference(key)) externalRefList.push([value, this.getReference(key)]);
        }

        return externalRefList;
    }

    /**
     * Sort _externalReferences by alphabetical order
     * Restart map for displaying references
     */
    public sortReferences() : void {
        // Sort map by alphabetical order on descriptions
        this._externalReferences = new Map([...this._externalReferences.entries()].sort((a,b) => a[1].description.localeCompare(b[1].description)));
        
        // Restart _externalReferencesIndex map
        this._externalReferencesIndex = new Map();
        // Start index at 1
        let index = 1;
        // Index 1
        for (let [key, value] of this._externalReferences) {
            // Add to map if it has a description
            if(value.description){
                // Do not include if description has (Citation: *)
                if(!value.description.includes("(Citation:")) {
                    this._externalReferencesIndex.set(key, index);
                    index += 1;
                }
            }
        }
    }

    /**
     * Return index of reference to display
     * Returns null if not found
     * @param sourceName source name of reference
     */
    public getIndexOfReference(sourceName : string) : number {
        if(this._externalReferencesIndex.get(sourceName)) {
            return this._externalReferencesIndex.get(sourceName);
        }
        return null;
    }

    /**
     * Return if value exists in external references
     * @param sourceName source name of reference
     */
    public hasValue(sourceName: string) : boolean {
        if (this._externalReferences.get(sourceName)) {
            return true;
        }
        return false;
    }

    /**
     * Return description of reference
     * @param sourceName source name of reference
     */
    public getDescription(sourceName: string) : string {
        if (this._externalReferences.get(sourceName)) {
            let source = this._externalReferences.get(sourceName)
            if (source["description"]) {
                return source["description"];
            }
        }
        return "";
    }

    /**
     * Return ExternalReference object of given source name
     * return undefined if not found
     * @param sourceName source name of reference
     */
    public getReference(sourceName : string) : ExternalReference {
        return this._externalReferences.get(sourceName);
    }

    /**
     * Add ExternalReference object to external references list
     * @param sourceName source name of reference
     * @param externalReference external reference object
     */
    private addReference(sourceName : string, externalReference : ExternalReference) {
        if (sourceName && externalReference) {
            this._externalReferences.set(sourceName, externalReference);
            // Sort references by description and update index map
            this.sortReferences()
        }
    }

    /**
     * Check if the reference is on the object, and add it if it is not.
     * Returns an observable that is true if the reference exists or has been added, and false if it couldn't be added
     * @param {string} sourceName  source name string of references
     * @param {RestApiConnectorService} restApiConnector the service to get references
     * @returns {Observable<boolean>} true if references is found in object or global external reference list, false if not
     */
    private checkAndAddReference(sourceName : string, restApiConnector: RestApiConnectorService): Observable<boolean> {
        if (this.getReference(sourceName)) return of(true);
        return restApiConnector.getReference(sourceName).pipe(
            map((result) => {
                let x = result as any[];
                if (x.length > 0) {
                    this.addReference(sourceName, x[0]);
                    return true;
                }
                return false;
            })
        );
    }

    /**
     * Parses value for references
     * @param value the value to match citations within
     * @param restApiConnector to connect to the REST API
     * @param validateReferencesAndCitations 
     */
    public parseCitations(value: string, restApiConnector: RestApiConnectorService): Observable<CitationParseResult> {
        let reReference = /\(Citation: (.*?)\)/gmu;
        let citations = value.match(reReference);
        let result = new CitationParseResult({
            brokenCitations: this.validateBrokenCitations(value, [/\(Citation:([^ ].*?)\)/gmu, /\(citation:(.*?)\)/gmu])
        })

        if (citations) {
            // build lookup api map
            let api_map = {};
            for (let i = 0; i < citations.length; i++) {
                // Split to get source name from citation
                let sourceName = citations[i].split("(Citation: ")[1].slice(0, -1);
                api_map[sourceName] = this.checkAndAddReference(sourceName, restApiConnector);
            }
            // check/add each citation
            return forkJoin(api_map).pipe(
                map((api_results) => {
                    let citation_results = api_results as any;
                    for (let key of Object.keys(citation_results)) {
                        // was the result able to be found/added?
                        if (citation_results[key]) result.usedCitations.add(key)
                        else result.missingCitations.add(key)
                    }
                    return result;
                })
            )
        } else {
            return of(result);
        }
    }

    /**
     * validate given field for broken citation found by regular expression
     * @param field descriptive field that may contain citation
     * @param {regex[]} regExes regular expression
     */
    private validateBrokenCitations(field, regExes): Set<string> {
        let result = new Set<string>();
        for (let regex of regExes) {
            let brokenReferences = field.match(regex);
            if (brokenReferences) {
                for (let i = 0; i < brokenReferences.length; i++) {
                    result.add(brokenReferences[i]);
                }
            }
        }
        return result;
    }

    /**
     * Parse citations from aliases which stores descriptions in external references
     * Add missing references to object if found in global external reference list 
     * @param aliases list of alias names
     * @param restApiConnector
     * @param validateReferencesAndCitations? Optional param to validate references and citations
     */
    public parseCitationsFromAliases(aliases : string[], restApiConnector : RestApiConnectorService): Observable<CitationParseResult> {
        // Parse citations from the alias descriptions stored in external references
        let api_calls = [];
        let result = new CitationParseResult();
        for (let i = 0; i < aliases.length; i++) {
            if (this._externalReferences.get(aliases[i])) {
                result.usedCitations.add(aliases[i]);
                api_calls.push(this.parseCitations(this._externalReferences.get(aliases[i]).description, restApiConnector));
            }
        }
        if (api_calls.length == 0) return of(result);
        else return forkJoin(api_calls).pipe( // get citation errors for each alias
            map((api_results) => {
                let citation_results = api_results as any;
                for (let citation_result of citation_results) { //merge into master list
                    result.merge(citation_result);
                }
                return result; //return master list
            })
        )
    }

    /**
     * Update external references map with given reference list
     * @param references list of references
     */
    public set externalReferences(references: any) {
        this._externalReferences = new Map();
        this._externalReferencesIndex = new Map();
        if (references){
            // Create externalReferences list
            for (let i = 0; i < references.length; i++){
                if ("source_name" in references[i] && !("external_id" in references[i])) {
                    let description = ""
                    if(references[i].description) {
                        description = references[i].description;
                    }
                    let url = ""
                    if(references[i].url) {
                        url = references[i].url;
                    }
    
                    let externalRef : ExternalReference = {
                        url : url,
                        description : description
                    }
    
                    this._externalReferences.set(references[i]['source_name'], externalRef);
                }
            }

            // Sort references by description and update index map
            this.sortReferences()
        }
    }

    /**
     * Construct an external references object
     * optional @param references external references list from collection
     */
    constructor(references?) {
        super();
        if (references) this.deserialize(references);
    }

    /**
     *  Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): ExternalReference[] {

        let rep: Array<{}> = [];

        for (const [key, value] of this._externalReferences) {
            let temp = {};

            temp["source_name"] = key;
            if (value["url"]) temp["url"] = value["url"];
            if (value["description"]) temp["description"] = value["description"];
            
            rep.push(temp);
        }
        
        return rep;
    }
    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if (typeof(raw) === "object") this.externalReferences = raw;
        else logger.error("TypeError: external_references field is not an object:", raw, "(",typeof(raw),")")
    }

    /**
     * Remove references which do not have the source name
     *
     * @param {string[]} usedSourceNames the source names that are used on the object; all other source names will be removed
     * @memberof ExternalReferences
     */
    public removeUnusedReferences(usedSourceNames: string[]) {
        // Create temp external references map from used references
        // Resulting map will remove unused references
        let temp_externalReferences : Map<string, ExternalReference> = new Map();
        for (let i = 0; i < usedSourceNames.length; i++) {
            let sourceName = usedSourceNames[i];
            if (this._externalReferences.get(sourceName)) temp_externalReferences.set(sourceName, this._externalReferences.get(sourceName));
        }

        
        let pre_delete_keys = Array.from(this._externalReferences.keys());
        // Update external references with used references
        this._externalReferences = temp_externalReferences;
        let post_delete_keys = Array.from(this._externalReferences.keys());
        logger.log("removed unused references", pre_delete_keys.filter((x) => !post_delete_keys.includes(x)))
        // Sort references by description and update index map
        this.sortReferences()
    }

    /*
     * Validate the current object state and return information on the result of the validation
     * Also removes unused external references.
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService, options: {fields: string[], object: StixObject}): Observable<ValidationData> {
        let result = new ValidationData();
        let parse_apis = [];
        for (let field of options.fields) {
            if (!Object.keys(options.object)) continue; //object does not implement the field
            if (field == "aliases") parse_apis.push(this.parseCitationsFromAliases(options.object[field], restAPIService))
            else parse_apis.push(this.parseCitations(options.object[field], restAPIService));
        }
        return forkJoin(parse_apis).pipe(
            map(api_results => {
                let parse_results = api_results as CitationParseResult[];
                let citationResult = new CitationParseResult();
                for (let parse_result of parse_results) {
                    citationResult.merge(parse_result); //merge all results into a single object
                }
                // use merged object to remove unused citations
                this.removeUnusedReferences(Array.from(citationResult.usedCitations));

                // add to validation result

                // broken citations
                let brokenCitations = Array.from(citationResult.brokenCitations);
                if (brokenCitations.length == 1) result.errors.push({
                    result: "error",
                    field: "external_references", //TODO set this to the actual field to improve warnings
                    message: `Citation ${brokenCitations[0]} does not match format (Citation: source name)`
                }) 
                else if (brokenCitations.length > 1) result.errors.push({
                    result: "error",
                    field: "external_references", //TODO set this to the actual field to improve warnings
                    message: `Citations ${brokenCitations.join(", ")} do not match format (Citation: source name)`
                })

                //missing citations
                let missingCitations = Array.from(citationResult.missingCitations);
                if (missingCitations.length == 1) result.errors.push({
                    result: "error",
                    field: "external_references", //TODO set this to the actual field to improve warnings
                    message: `Cannot find reference: ${missingCitations[0]} `
                }) 
                else if (missingCitations.length > 1) result.errors.push({
                    result: "error",
                    field: "external_references", //TODO set this to the actual field to improve warnings
                    message: `Cannot find references: ${missingCitations.join(", ")}`
                })
                //return the result
                return result;
            })
        )
    }
}

export interface ExternalReference {
    /** source name of the reference */
    source_name?: string;
    /** url; url of reference */
    url?: string;
    /** description; description of reference */
    description?: string;
}

/**
 * The results of parsing citations in a single field
 */
export class CitationParseResult {
    //list of reference source names which have been used in this field
    public usedCitations: Set<string> = new Set();
    //citations that could not be found
    public missingCitations: Set<string> = new Set();
    // list of broken references detected in the field
    public brokenCitations: Set<string> = new Set(); 

    constructor(initData?: {usedCitations?: Set<string>, missingCitations?: Set<string>, brokenCitations: Set<string>}) {
        if (initData && initData.usedCitations) this.usedCitations = initData.usedCitations;
        if (initData && initData.missingCitations) this.missingCitations = initData.missingCitations;
        if (initData && initData.brokenCitations) this.brokenCitations = initData.brokenCitations;
    }

    /**
     * Merge results from another CitationParseResult into this object
     * @param {CitationParseResult} that results from other object
     */
    public merge(that: CitationParseResult) {
        this.usedCitations = new Set([...this.usedCitations, ...that.usedCitations]);
        this.missingCitations = new Set([...this.missingCitations, ...that.missingCitations]);
        this.brokenCitations = new Set([...this.brokenCitations, ...that.brokenCitations]);
    }
}