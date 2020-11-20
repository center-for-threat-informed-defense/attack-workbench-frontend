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
        var index = 1;
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
     * return 0 if it was not found
     * @param sourceName source name of reference
     */
    public getIndexOfReference(sourceName : string) : number {
        if(this._externalReferencesIndex.get(sourceName)) {
            return this._externalReferencesIndex.get(sourceName);
        }
        return 0;
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
            for (var i = 0; i < references.length; i++){

                var externalRef : ExternalReference = new ExternalReference();

                externalRef.url = references[i].url;

                if(references[i].description) {
                    externalRef.description = references[i].description;
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

export class ExternalReference {
    /** url; force */
    private _url: string;
    /** description; remove references from descriptive field if true */
    private _description: string;

    /**
     * Construct an external reference object
     */
    constructor() {};

    /**
     * Set url 
     * @param url string of reference url
     */
    public set url(url:string) { this._url = url; };

    /**
     * Set description 
     * @param description string of reference description
     */
    public set description(description:string) { this._description = description; };

    /**
     * return external references list
     */
    public get description() : string { 
        if (this._description) {
            return this._description; 
        }
        return ""
    }

    /**
     * return url
     */
    public get url() : string { return this._url; }

}