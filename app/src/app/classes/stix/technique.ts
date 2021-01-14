import { StixObject } from "./stix-object";

export class Technique extends StixObject {
    public attackID: string;
    public name: string;
    public description: string;
    public tactics: string[];

    public domains: string[];
    public platforms: string[];
    public detection: string;
    public dataSources: string[];
    public systemRequirements: string;
    public tacticTypes: string;
    public permissionsRequired: string[]
    public defenseBypassed: string[];

    public isSubtechnique: boolean;
    public remoteSupport: boolean;

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
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} raw the raw object to parse
     */
    public deserialize(raw: any) {
        let sdo = raw;

        let isStringArray = function(arr): boolean {
            for (let i = 0; i < arr.length; i++) {
                if (typeof(arr[i]) !== "string") {
                    console.error("TypeError:", arr[i], "(",typeof(arr[i]),")", "is not a string")
                    return false;
                }
            }
            return true;
        }

        if ("external_references" in sdo) {
            if (sdo.external_references.length > 0){
                if (typeof(sdo.external_references[0].external_id) === "string") this.attackID = sdo.external_references[0].external_id;
                else console.error("TypeError: attackID field is not a string:", sdo.external_references[0].external_id, "(", typeof(sdo.external_references[0].external_id),")");
            }
            else console.error("ObjectError: external references is empty");
        }
        if ("name" in sdo) {
            if (typeof(sdo.name) === "string") this.name = sdo.name;
            else console.error("TypeError: name field is not a string:", sdo.name, "(", typeof(sdo.name),")");
        }
        if ("description" in sdo) {
            if (typeof(sdo.description) === "string") this.description = sdo.description;
            else console.error("TypeError: description field is not a string:", sdo.description, "(", typeof(sdo.description),")");
        }
        if ("kill_chain_phases" in sdo) {
            if (typeof(sdo.kill_chain_phases) == "object") {
                this.tactics = sdo.kill_chain_phases.map(tactic => tactic.phase_name);
            }
            else console.error("TypeError: tactics field is not an object:", sdo.kill_chain_phases, "(", typeof(sdo.kill_chain_phases), ")");
        }
        if ("x_mitre_domains" in sdo) {
            if (isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
            else console.error("TypeError: domains field is not a string array.");
        }
        if ("x_mitre_detection" in sdo) {
            if (typeof(sdo.x_mitre_detection) === "string") this.detection = sdo.x_mitre_detection;
            else console.error("TypeError: detection field is not a string:", sdo.x_mitre_detection, "(", typeof(sdo.x_mitre_detection),")");
        }
        if ("x_mitre_platforms" in sdo) {
            if (isStringArray(sdo.x_mitre_platforms)) this.platforms = sdo.x_mitre_platforms;
            else console.error("TypeError: platforms field is not a string array.");
        }
        if ("x_mitre_data_sources" in sdo) {
            if (isStringArray(sdo.x_mitre_data_sources)) this.dataSources = sdo.x_mitre_data_sources;
            else console.error("TypeError: data sources field is not a string array.");
        }
        if ("x_mitre_system_requirements" in sdo) {
            if (typeof(sdo.x_mitre_system_requirements) === "string") this.systemRequirements = sdo.x_mitre_system_requirements;
            else console.error("TypeError: system requirements field is not a string:", sdo.x_mitre_system_requirements, "(", typeof(sdo.x_mitre_system_requirements),")");
        }
        if ("x_mitre_tactic_types" in sdo) {
            if (typeof(sdo.x_mitre_tactic_types) === "string") this.tacticTypes = sdo.x_mitre_tactic_types;
            else console.error("TypeError: tactic types field is not a string:", sdo.x_mitre_tactic_types, "(", typeof(sdo.x_mitre_tactic_types),")");
        }
        if ("x_mitre_permissions_required" in sdo) {
            if (isStringArray(sdo.x_mitre_permissions_required)) this.permissionsRequired = sdo.x_mitre_permissions_required;
            else console.error("TypeError: permissions required field is not a string array.");
        }
        if ("x_mitre_defense_bypassed" in sdo) {
            if (isStringArray(sdo.x_mitre_defense_bypassed)) this.defenseBypassed = sdo.x_mitre_defense_bypassed;
            else console.error("TypeError: defense bypassed field is not a string array.");
        }
        if ("x_mitre_is_subtechnique" in sdo) {
            if (typeof(sdo.x_mitre_is_subtechnique) === "boolean") this.isSubtechnique = sdo.x_mitre_is_subtechnique;
            else console.error("TypeError: is subtechnique field is not a boolean:", sdo.x_mitre_is_subtechnique, "(", typeof(sdo.x_mitre_is_subtechnique),")")
        }
        if ("x_mitre_remote_support" in sdo) {
            if (typeof(sdo.x_mitre_remote_support) === "boolean") this.isSubtechnique = sdo.x_mitre_remote_support;
            else console.error("TypeError: remote support field is not a boolean:", sdo.x_mitre_remote_support, "(", typeof(sdo.x_mitre_remote_support),")")
        }
    }
}