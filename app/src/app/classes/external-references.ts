export class ExternalReferences {
    private _externalReferences : Map<string, ExternalReference> = new Map();
    private _currentCounter : number = 0;

    /**
     * return external references list
     */
    public get externalReferences() { return this._externalReferences; }

    /**
     * return current counter
     */
    public get currentCounter() : number { return this._currentCounter; }

    /**
     * Update reference counter and increase current counter by 1 
     * @param sourceName index of reference
     */
    public updateReference(sourceName: string) : void {
        if(this.externalReferences[sourceName]) {
            // Update current counter first
            this._currentCounter = this._currentCounter + 1;
            // Update reference counter
            this.externalReferences[sourceName]['counter'] = this.currentCounter;
        }
    }

    /**
     * Update external references map with given reference list
     * @param references list of references
     */
    public set externalReferences(references: any) {
        if (references){
            // Create externalReferences list
            for (var i = 0; i < references.length; i++){

                // Avoid MITRE ATT&CK tags
                if (references[i]['external_id']){
                    continue;
                }

                var externalRef : ExternalReference = new ExternalReference();

                externalRef.url = references[i].url;
                externalRef.description = references[i].description;

                this._externalReferences.set(references[i]['source_name'], externalRef);

            }
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
    /** counter; counter to keep track of usage */
    private _counter: number;

    /**
     * Construct an external reference object
     * Counter will be null when created
     */
    constructor() {
        this._counter = null;
    };

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
     * Set description 
     * @param counter counter for reference use
     */
    public set counter(counter:number) { this._counter = counter; };
}