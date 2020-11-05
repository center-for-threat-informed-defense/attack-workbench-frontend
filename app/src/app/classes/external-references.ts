export class ExternalReferences {
    private externalReferences = {};
    private currentCounter = 0;

    /**
     * return external references list
     */
    public getExternalReferences() {
        return this.externalReferences;
    }

    /**
     * return current counter
     */
    public getCurrentCounter() {
        return this.currentCounter;
    }

    /**
     * Update reference counter and increase current counter by 1 
     * @params {sourceName} index of reference
     */
    public updateReference(sourceName: string) {
        if(this.externalReferences[sourceName]) {
            // Update current counter first
            this.currentCounter = this.currentCounter + 1;
            // Update reference counter
            this.externalReferences[sourceName]['counter'] = this.currentCounter;
        }
    }

    /**
     * Construct an external reference object
     * @params reference list from collection
     */
    constructor(references) {
        // Create externalReferences object
        for (var i = 0; i < references.length; i++){

            // Avoid MITRE ATT&CK tags
            if (references[i]['external_id']){
                continue;
            }

            var index = references[i]['source_name'];
            this.externalReferences[index] = {};

            this.externalReferences[index]['url'] = references[i].url;
            this.externalReferences[index]['description'] = references[i].description;
            this.externalReferences[index]['counter'] = null;
        }
    }
}