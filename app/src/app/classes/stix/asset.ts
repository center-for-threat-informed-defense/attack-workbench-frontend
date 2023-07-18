import { StixObject } from "./stix-object";
import { logger } from "../../util/logger";
import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";

export class Asset extends StixObject {
    public name: string = "";
    public contributors: string[] = [];
    public sectors: string[] = [];
    public relatedAssets: RelatedAsset[] = [];
    public platforms: string[] = [];

    // assets are ICS-only
    public domains: string[] = ['ics-attack'];

    public readonly supportsAttackID = true;
    public readonly supportsNamespace = true;
    protected get attackIDValidator() {
        return {
            regex: "A\\d{4}",
            format: "A####"
        }
    }

    constructor(sdo?: any) {
        super(sdo, "x-mitre-asset");
        if (sdo) {
            this.deserialize(sdo);
        }
    }

    /**
     * Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public serialize(): any {
        let rep = super.base_serialize();

        rep.stix.name = this.name.trim();
        rep.stix.x_mitre_domains = this.domains;
        rep.stix.x_mitre_sector = this.sectors;
        rep.stix.x_mitre_related_assets = this.relatedAssets.map((asset: RelatedAsset) => {
            return {
                name: asset.name.trim(),
                related_asset_sector: asset.sector,
                description: asset.description
            }
        });
        rep.stix.x_mitre_platforms = this.platforms;
        rep.stix.x_mitre_contributors = this.contributors.map(x => x.trim());

        return rep;
    }

    public isRelatedAssetArray(arr: any[]): boolean {
        return arr.every(a => this.instanceOfRelatedAsset(a));
    }

    public instanceOfRelatedAsset(object: any): boolean {
        return 'name' in object && 'description' in object && 'sector' in object;
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        if ("stix" in raw) {
            let sdo = raw.stix;

            if ("name" in sdo) {
                if (typeof(sdo.name) === "string") this.name = sdo.name;
                else logger.error("TypeError: name field is not a string:", sdo.name, "(",typeof(sdo.name),")")
            } else this.name = "";

            if ("x_mitre_sectors" in sdo) {
                if (this.isStringArray(sdo.x_mitre_sectors)) this.sectors = sdo.x_mitre_sectors;
                else logger.error("TypeError: x_mitre_sectors field is not a string array.");
            } else this.sectors = [];

            if ("x_mitre_related_assets" in sdo) {
                if (this.isRelatedAssetArray(sdo.x_mitre_related_assets)) this.relatedAssets = sdo.x_mitre_related_assets;
                else logger.error("TypeError: x_mitre_related_assets field is not an array of related assets.");
            } else this.relatedAssets = [];

            if ("x_mitre_platforms" in sdo) {
                if (this.isStringArray(sdo.x_mitre_platforms)) this.platforms = sdo.x_mitre_platforms;
                else logger.error("TypeError: platforms field is not a string array.");
            } else this.platforms = [];

            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else logger.error("TypeError: domains field is not a string array.");
            } else this.domains = ["ics-attack"];

            if ("x_mitre_contributors" in sdo) {
                if (this.isStringArray(sdo.x_mitre_contributors)) this.contributors = sdo.x_mitre_contributors;
                else logger.error("TypeError: x_mitre_contributors is not a string array:", sdo.x_mitre_contributors, "(",typeof(sdo.x_mitre_contributors),")")
            } else this.contributors = [];
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return this.base_validate(restAPIService);
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<Asset> {
        let postObservable = restAPIService.postAsset(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }

    /**
     * Delete this STIX object from the database.
     * @param restAPIService [RestApiConnectorService] the service to perform the DELETE through
     */
    public delete(restAPIService: RestApiConnectorService) : Observable<{}> {
        let deleteObservable = restAPIService.deleteAsset(this.stixID);
        let subscription = deleteObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
        return deleteObservable;
    }
}

export interface RelatedAsset {
    name: string;
    sector: string;
    description: string;
}