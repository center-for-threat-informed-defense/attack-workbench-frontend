import { StixObject } from "./stix-object";

export class Technique extends StixObject {
    public attackID: string = "";
    public name: string = "";
    public description: string = "";
    public tactics: string[] = [];

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
        let rep: {[k: string]: any } = {};

        rep.stix = super.base_serialize();
        rep.stix.name = this.name;
        rep.stix.description = this.description;
        rep.stix.x_mitre_domains = this.domains;
        rep.stix.x_mitre_detection = this.detection;
        rep.stix.x_mitre_platforms = this.platforms;

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

        if (this.attackID) {
            let new_ext_ref = {
                "source_name": "mitre-attack",
                "external_id": this.attackID
            }
            if (this.isSubtechnique()) {
                let divider = this.attackID.split(".");
                new_ext_ref["url"] = "https://attack.mitre.org/techniques/" + divider[0] + "/" + divider[1];
            }
            else new_ext_ref["url"] = "https://attack.mitre.org/techniques/" + this.attackID;

            rep.stix.external_references.unshift(new_ext_ref);
        }

        rep.stix.kill_chain_phases = this.tactics.map( (tactic) => {
            return {
                "kill_chain_name": "mitre-attack",
                "phase_name": tactic
            }
        });

        console.log("serialized: ", rep)
        return JSON.stringify(rep);
    }

    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        console.log("raw object: ", raw)
        if ("stix" in raw) {
            let sdo = raw.stix;

            if ("external_references" in sdo) {
                if (sdo.external_references.length > 0){
                    if (typeof(sdo.external_references[0].external_id) === "string") this.attackID = sdo.external_references[0].external_id;
                    else console.error("TypeError: attackID field is not a string:", sdo.external_references[0].external_id, "(", typeof(sdo.external_references[0].external_id),")");
                }
                else console.error("ObjectError: external references is empty");
            } else this.attackID = "";

            if ("name" in sdo) {
                if (typeof(sdo.name) === "string") this.name = sdo.name;
                else console.error("TypeError: name field is not a string:", sdo.name, "(", typeof(sdo.name),")");
            } else this.name = "";

            if ("description" in sdo) {
                if (typeof(sdo.description) === "string") this.description = sdo.description;
                else console.error("TypeError: description field is not a string:", sdo.description, "(", typeof(sdo.description),")");
            } else this.description = "";

            if ("kill_chain_phases" in sdo) {
                if (typeof(sdo.kill_chain_phases) == "object") {
                    this.tactics = sdo.kill_chain_phases.map(tactic => tactic.phase_name);
                }
                else console.error("TypeError: tactics field is not an object:", sdo.kill_chain_phases, "(", typeof(sdo.kill_chain_phases), ")");
            } else this.tactics = [];

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

        this.serialize();
    }

    /**
     * Verify if the attackID is has the form of a subtechnique
     * @returns boolean, true if it is a subtechnique
     */
    private isSubtechnique() {
        if (this.attackID.split(".").length == 2) {
            return true;
        }
        return false;
    }
}