import { Serializable } from "./serializable";

export class ExternalReferences extends Serializable {
    private _externalReferences : Map<string, ExternalReference> = new Map();
    private _externalReferencesIndex : Map<string, number> = new Map();

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
     * throws error if source name is not found
     * @param sourceName source name of reference
     */
    public getIndexOfReference(sourceName : string) : number {
        if(this._externalReferencesIndex.get(sourceName)) {
            return this._externalReferencesIndex.get(sourceName);
        }
        throw new Error(`could not find source name "${sourceName}"`);
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
     * Update external references map with given reference list
     * @param references list of references
     */
    public set externalReferences(references: any) {
        if (references){
            // Create externalReferences list
            for (let i = 0; i < references.length; i++){
                if ("source_name" in references[i]) {
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
    public serialize(): any {
        return {}; //TODO
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
}

export interface ExternalReference {
    /** url; url of reference */
    url: string;
    /** description; description of reference */
    description: string;
}