export class ExternalReferences {
    private _externalReferences : Map<string, ExternalReference> = new Map();
    private _externalReferencesIndex : Map<string, number> = new Map();

    /**
     * return external references list
     */
    public get externalReferences() { return this._externalReferences; }

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
                this._externalReferencesIndex.set(key, index);
                index += 1;
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

            // Sort references by description and update index map
            this.sortReferences()
        }
    }

    /**
     * Construct an external references object
     * optional @param references external references list from collection
     */
    constructor(references?) {
        this.externalReferences = references;
    }
}

export interface ExternalReference {
    /** url; url of reference */
    url: string;
    /** description; description of reference */
    description: string;
}