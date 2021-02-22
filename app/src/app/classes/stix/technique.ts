import { Observable } from "rxjs";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { StixObject } from "./stix-object";

export class Technique extends StixObject {
    public name: string = "";

    public kill_chain_phases: any = [];
    public domains: string[] = [];
    public platforms: string[] = [];
    public detection: string = "";
    public data_sources: string[] = [];
    public system_requirements: string[] = [];
    public tactic_type: string[] = [];
    public permissions_required: string[] = [];
    public defense_bypassed: string[] = [];

    public is_subtechnique: boolean = false;
    public remote_support: boolean = false;

    public get tactics(): string[] { return this.kill_chain_phases.map(tactic => tactic.phase_name); }

    /**
     * Initialize Technique object
     * @param sdo the STIX domain object to initialize data from
     */
    constructor(sdo?: any) {
        super(sdo, "attack-pattern");
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
        
        rep.stix.name = this.name;
        rep.stix.x_mitre_domains = this.domains;
        rep.stix.x_mitre_detection = this.detection;
        rep.stix.x_mitre_platforms = this.platforms;
        rep.stix.kill_chain_phases = this.kill_chain_phases;

        // domain specific fields
        if (this.domains.includes('ics-attack')) {
            rep.stix.x_mitre_data_sources = this.data_sources;
        }
        if (this.domains.includes('mobile-attack')) {
            rep.stix.x_mitre_tactic_type = this.tactic_type;
        }
        if (this.domains.includes('enterprise-attack')) {
            rep.stix.x_mitre_data_sources = this.data_sources;
            rep.stix.x_mitre_is_subtechnique = this.is_subtechnique;
            rep.stix.x_mitre_system_requirements = this.system_requirements;

            // tactic specific fields
            if (this.tactics.includes('privilege-escalation')) rep.stix.x_mitre_permissions_required = this.permissions_required;
            if (this.tactics.includes('defense-evasion')) rep.stix.x_mitre_defense_bypassed = this.defense_bypassed;
            if (this.tactics.includes('execution')) rep.stix.x_mitre_remote_support = this.remote_support;
        }

        return rep;
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
                else console.error("TypeError: name field is not a string:", sdo.name, "(", typeof(sdo.name),")");
            } else this.name = "";

            if ("kill_chain_phases" in sdo) {
                if (typeof(sdo.kill_chain_phases) == "object") {
                    this.kill_chain_phases = sdo.kill_chain_phases;
                }
                else console.error("TypeError: tactics field is not an object:", sdo.kill_chain_phases, "(", typeof(sdo.kill_chain_phases), ")");
            } else this.kill_chain_phases = [];

            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else console.error("TypeError: domains field is not a string array.");
            } else this.domains = [];

            if ("x_mitre_detection" in sdo) {
                if (typeof(sdo.x_mitre_detection) === "string") this.detection = sdo.x_mitre_detection;
                else console.error("TypeError: detection field is not a string:", sdo.x_mitre_detection, "(", typeof(sdo.x_mitre_detection),")");
            } else this.detection = "";

            if ("x_mitre_platforms" in sdo) {
                if (this.isStringArray(sdo.x_mitre_platforms)) this.platforms = sdo.x_mitre_platforms;
                else console.error("TypeError: platforms field is not a string array.");
            } else this.platforms = [];

            if ("x_mitre_data_sources" in sdo) {
                if (this.isStringArray(sdo.x_mitre_data_sources)) this.data_sources = sdo.x_mitre_data_sources;
                else console.error("TypeError: data sources field is not a string array.");
            } else this.data_sources = [];

            if ("x_mitre_system_requirements" in sdo) {
                if (this.isStringArray(sdo.x_mitre_system_requirements)) this.system_requirements = sdo.x_mitre_system_requirements;
                else console.error("TypeError: system requirements field is not a string array.");
            } else this.system_requirements = [];

            if ("x_mitre_tactic_type" in sdo) {
                if (this.isStringArray(sdo.x_mitre_tactic_type)) this.tactic_type = sdo.x_mitre_tactic_type;
                else console.error("TypeError: tactic types field is not a string array.");
            } else this.tactic_type = [];

            if ("x_mitre_permissions_required" in sdo) {
                if (this.isStringArray(sdo.x_mitre_permissions_required)) this.permissions_required = sdo.x_mitre_permissions_required;
                else console.error("TypeError: permissions required field is not a string array.");
            } else this.permissions_required = [];

            if ("x_mitre_defense_bypassed" in sdo) {
                if (this.isStringArray(sdo.x_mitre_defense_bypassed)) this.defense_bypassed = sdo.x_mitre_defense_bypassed;
                else console.error("TypeError: defense bypassed field is not a string array.");
            } else this.defense_bypassed = [];

            if ("x_mitre_is_subtechnique" in sdo) {
                if (typeof(sdo.x_mitre_is_subtechnique) === "boolean") this.is_subtechnique = sdo.x_mitre_is_subtechnique;
                else console.error("TypeError: is subtechnique field is not a boolean:", sdo.x_mitre_is_subtechnique, "(", typeof(sdo.x_mitre_is_subtechnique),")")
            }
            
            if ("x_mitre_remote_support" in sdo) {
                if (typeof(sdo.x_mitre_remote_support) === "boolean") this.remote_support = sdo.x_mitre_remote_support;
                else console.error("TypeError: remote support field is not a boolean:", sdo.x_mitre_remote_support, "(", typeof(sdo.x_mitre_remote_support),")")
            }
        }
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param new_version [boolean] if false, overwrite the current version of the object. If true, creates a new version.
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(new_version: boolean = true, restAPIService: RestApiConnectorService): Observable<Technique> {
        // TODO POST if the object was just created (doesn't exist in db yet)
        if (new_version) this.modified = new Date();
        
        let postObservable = restAPIService.postTechnique(this);
        let subscription = postObservable.subscribe({
            next: (result) => { this.deserialize(result); },
            complete: () => { subscription.unsubscribe(); }
        });
        return postObservable;
    }
}