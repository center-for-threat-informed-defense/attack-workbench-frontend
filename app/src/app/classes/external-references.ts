import { Observable, of } from "rxjs";
import { RestApiConnectorService } from "../services/connectors/rest-api/rest-api-connector.service";
import { Serializable, ValidationData } from "./serializable";

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
            externalRefList.push([value, this.getReference(key)]);
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
     * checkReferences()
     * Check if reference exists
     * @param sourceName source name string of references
     * @param restApiConnector RestApiConnectorService] the service to get references
     * @returns true if references is found in object or global external reference list, false if not
     */
    private checkReferences(sourceName : string, restApiConnector) : boolean {
        let search_result: ExternalReference = null;

        if (this.getReference(sourceName)) return true;
        let subscription = restApiConnector.getReference(sourceName).subscribe({
            next: (result) => { 
                if (result.length){
                    search_result = result[0];
                    this.addReference(sourceName, search_result);
                    return true;
                }
            },
            complete: () => { subscription.unsubscribe(); }
        })

        // If it reached here then it failed to find
        return false;
    }

    /**
     * Parses field for references
     * @param field 
     * @param restApiConnector 
     * @param validateReferencesAndCitations 
     */
    public parseCitations(field: string, restApiConnector: RestApiConnectorService, validateReferencesAndCitations=false) : void {
        let reReference = /\(Citation: (.*?)\)/gmu;
        let citations = field.match(reReference);
        if (citations) {
            for (let i = 0; i < citations.length; i++) {
                // Split to get source name from citation
                let sourceName = citations[i].split("(Citation: ")[1].slice(0, -1);
                if (validateReferencesAndCitations) {
                    if (!this.checkReferences(sourceName, restApiConnector)) if (this.missingReferences.indexOf(sourceName) == -1) this.missingReferences.push(sourceName);
                    if (this.usedReferences.indexOf(sourceName) == -1) this.usedReferences.push(sourceName);
                }
                else this.checkReferences(sourceName, restApiConnector);
            }
        }

        // Extra validation for broken citations such as (Citation:xyz) and (citation: xyz)
        if (validateReferencesAndCitations) {
            // Check citations missing space between (Citation: xyz) like (Citation:xyz)
            this.validateBrokenCitations(field, /\(Citation:([^ ].*?)\)/gmu);

            // Check citations with wrong capitalization like (citation: xyz), will also pick up (citation:xyz)
            this.validateBrokenCitations(field, /\(citation:(.*?)\)/gmu);
        }
    }

    /**
     * validate given field for broken citation found by regular expression
     * @param field descriptive field that may contain citation
     * @param regEx regular expression
     */
    private validateBrokenCitations(field, regEx) : void {
        let brokenReferences = field.match(regEx);
        if (brokenReferences) {
            for (let i = 0; i < brokenReferences.length; i++) {
                if (this.usedReferences.indexOf(brokenReferences[i]) == -1) this.brokenCitations.push(brokenReferences[i]);
            }
        }
    }

    /**
     * Parse citations from aliases which stores descriptions in external references
     * Add missing references to object if found in global external reference list 
     * @param aliases list of alias names
     * @param restApiConnector
     * @param validateReferencesAndCitations? Optional param to validate references and citations
     */
    public parseCitationsFromAliases(aliases : string[], restApiConnector : RestApiConnectorService, validateReferencesAndCitations=false) : void {
        // Parse citations from the alias descriptions stored in external references
        for (let i = 0; i < aliases.length; i++) {
            if (this._externalReferences.get(aliases[i])) {
                this.parseCitations(this._externalReferences.get(aliases[i]).description, restApiConnector, validateReferencesAndCitations)
                if (validateReferencesAndCitations) if (this.usedReferences.indexOf(aliases[i]) == -1) this.usedReferences.push(aliases[i]);
            }
        }
    }

    /**
     * Update external references map with given reference list
     * @param references list of references
     */
    public set externalReferences(references: any) {
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
    public serialize(): Array<{}> {

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
        else console.error("TypeError: external_references field is not an object:", raw, "(",typeof(raw),")")
    }

    /**
     * Get missing external references and
     * Remove external references that are not used
     * @returns {string} return string of missing references that were not found in object or directive list
     */
     public getMissingReferencesAndRemoveUnusedReferencesStr(): string {

        // Create temp external references map from used references
        // Resulting map will remove unused references
        let temp_externalReferences : Map<string, ExternalReference> = new Map();
        for (let i = 0; i < this.usedReferences.length; i++) {
            let sourceName = this.usedReferences[i];
            if (this._externalReferences.get(sourceName)) temp_externalReferences.set(sourceName, this._externalReferences.get(sourceName));
        }

        // Update external references with used references
        this._externalReferences = temp_externalReferences;

        // Build missing references string
        let missingReferencesStr = ""
        
        if (this.missingReferences.length) {
            if (this.missingReferences.length == 1) missingReferencesStr += "Cannot find missing reference: ";
            else missingReferencesStr += "Cannot find missing references: ";

            missingReferencesStr += this.missingReferences.join(", ");
        }
        
        // Reset usedRefences and missingReferences
        this.usedReferences = [];
        this.missingReferences = [];

        // Return missing references to warn the user
        return missingReferencesStr;
    }

    /**
     * getBrokenCitationsStr
     * @returns {string} return string of broken citations such as missing space or wrong capitalization
     */
     public getBrokenCitationsStr(): string {
        // Build string of references missing space string
        let brokenCitationsStr = ""

        // “Citation(s) […] do(es) not match format (Citation: source name)” for missing spaces and capitalization issues
        if (this.brokenCitations.length) {
            if (this.brokenCitations.length == 1) {
                brokenCitationsStr += "Citation " + this.brokenCitations[0] + " does not match format (Citation: source name)"
            }
            else brokenCitationsStr += "Citations " + this.brokenCitations.join(", ") + " do not match format (Citation: source name)"
        }
        
        // Reset brokenCitations
        this.brokenCitations = [];

        // Return broken citations to warn the user
        return brokenCitationsStr;
     }

    /*
     * Validate the current object state and return information on the result of the validation
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return of(new ValidationData()) //TODO
    }
}

export interface ExternalReference {
    /** source name of the reference */
    source_name?: string;
    /** url; url of reference */
    url: string;
    /** description; description of reference */
    description: string;
}