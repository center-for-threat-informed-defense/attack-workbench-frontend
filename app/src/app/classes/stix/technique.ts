import { forkJoin, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import { StixObject } from "./stix-object";
import { logger } from "../../util/logger";
import { Tactic } from "./tactic";

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
    public effective_permissions: string[] = [];
    public impact_type: string[] = [];
    public contributors: string[] = [];
    public supports_remote: boolean = false;
    public is_subtechnique: boolean = false;
    public show_subtechniques: boolean = false; // used by matrix view to handle displaying subtechniques

    public readonly supportsAttackID = true;
    public readonly supportsNamespace = true;
    protected get attackIDValidator() { return {
        regex: this.is_subtechnique? "T\\d{4}\\.\\d{3}" : "T\\d{4}",
        format: this.is_subtechnique? "T####.###" : "T####"
    }}

    // NOTE: the following two fields will only be populated when this object is fetched using getTechnique().
    //       they will NOT be populated when fetched using getAllTechniques().
    public subTechniques: Technique[] = [];
    public parentTechnique: Technique = null;

    private killChainMap = {
        "enterprise-attack": "mitre-attack",
        "mobile-attack": "mitre-mobile-attack",
        "ics-attack": "mitre-ics-attack"
    }

    public get tactics(): string[] { return this.kill_chain_phases.map(tactic => tactic.phase_name); }
    public set tactics(values) {
        let killChainPhases = [];
        for (let i in values) {
            let phaseName = values[i][0];
            let killChainName = this.killChainMap[values[i][1]];
            killChainPhases.push({
                "phase_name": phaseName,
                "kill_chain_name": killChainName
            });
        }
        this.kill_chain_phases = killChainPhases;
    }

    public capec_ids: string[] = [];
    public mtc_ids: string[] = [];

    private mtcUrlMap = {
        "APP": "application-threats",
        "AUT": "authentication-threats",
        "CEL": "cellular-threats",
        "ECO": "ecosystem-threats",
        "EMM": "emm-threats",
        "GPS": "gps-threats",
        "LPN": "lan-pan-threats",
        "PAY": "payment-threats",
        "PHY": "physical-threats",
        "PRI": "privacy-threats",
        "STA": "stack-threats",
        "SPC": "supply-chain-threats"
    }

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

        rep.stix.name = this.name.trim();
        rep.stix.x_mitre_domains = this.domains;
        rep.stix.x_mitre_detection = this.detection;
        rep.stix.x_mitre_platforms = this.platforms;
        rep.stix.kill_chain_phases = this.kill_chain_phases;
        rep.stix.x_mitre_is_subtechnique = this.is_subtechnique;
        rep.stix.x_mitre_contributors = this.contributors.map(x => x.trim());

        // domain specific fields
        if (this.domains.includes('ics-attack')) {
            rep.stix.x_mitre_data_sources = this.data_sources;
        }
        if (this.domains.includes('mobile-attack')) {
            rep.stix.x_mitre_tactic_type = this.tactic_type;
        }
        if (this.domains.includes('enterprise-attack')) {
            rep.stix.x_mitre_data_sources = this.data_sources;
            rep.stix.x_mitre_system_requirements = this.system_requirements.map(x => x.trim());

            // tactic specific fields
            if (this.tactics.includes('privilege-escalation')) {
                rep.stix.x_mitre_permissions_required = this.permissions_required;
                rep.stix.x_mitre_effective_permissions = this.effective_permissions;
            }
            if (this.tactics.includes('defense-evasion')) rep.stix.x_mitre_defense_bypassed = this.defense_bypassed.map(x => x.trim());
            if (this.tactics.includes('execution')) rep.stix.x_mitre_remote_support = this.supports_remote;
            if (this.tactics.includes('impact')) rep.stix.x_mitre_impact_type = this.impact_type;
        }

        // mtc & capec ids
        if (rep.stix.external_references) {
            if (this.domains.includes('mobile-attack')) {
                if (this.mtc_ids.length) {
                    for (let id of this.mtc_ids) {
                        let temp = {}
                        temp["url"] = "https://pages.nist.gov/mobile-threat-catalogue/" + this.mtcUrlMap[id.trim().split('-')[0]] + "/" + id + ".html";
                        temp["source_name"] = "NIST Mobile Threat Catalogue";
                        temp["external_id"] = id.trim();
                        rep.stix.external_references.push(temp);
                    }
                }
            }
            if (this.domains.includes('enterprise-attack')) {
                if (this.capec_ids.length) {
                    for (let id of this.capec_ids) {
                        let temp = {}
                        temp["url"] = "https://capec.mitre.org/data/definitions/" + id.trim().split('-')[1] + ".html";
                        temp["source_name"] = "capec";
                        temp["external_id"] = id.trim();
                        rep.stix.external_references.push(temp);
                    }
                }
            }
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
                else logger.error("TypeError: name field is not a string:", sdo.name, "(", typeof(sdo.name),")");
            } else this.name = "";

            if ("kill_chain_phases" in sdo) {
                if (typeof(sdo.kill_chain_phases) == "object") {
                    this.kill_chain_phases = sdo.kill_chain_phases;
                }
                else logger.error("TypeError: tactics field is not an object:", sdo.kill_chain_phases, "(", typeof(sdo.kill_chain_phases), ")");
            } else this.kill_chain_phases = [];

            if ("x_mitre_domains" in sdo) {
                if (this.isStringArray(sdo.x_mitre_domains)) this.domains = sdo.x_mitre_domains;
                else logger.error("TypeError: domains field is not a string array.");
            } else this.domains = [];

            if ("x_mitre_detection" in sdo) {
                if (typeof(sdo.x_mitre_detection) === "string") this.detection = sdo.x_mitre_detection;
                else logger.error("TypeError: detection field is not a string:", sdo.x_mitre_detection, "(", typeof(sdo.x_mitre_detection),")");
            } else this.detection = "";

            if ("x_mitre_platforms" in sdo) {
                if (this.isStringArray(sdo.x_mitre_platforms)) this.platforms = sdo.x_mitre_platforms;
                else logger.error("TypeError: platforms field is not a string array.");
            } else this.platforms = [];

            if ("x_mitre_data_sources" in sdo) {
                if (this.isStringArray(sdo.x_mitre_data_sources)) this.data_sources = sdo.x_mitre_data_sources;
                else logger.error("TypeError: data sources field is not a string array.");
            } else this.data_sources = [];

            if ("x_mitre_system_requirements" in sdo) {
                if (this.isStringArray(sdo.x_mitre_system_requirements)) this.system_requirements = sdo.x_mitre_system_requirements;
                else logger.error("TypeError: system requirements field is not a string array.");
            } else this.system_requirements = [];

            if ("x_mitre_tactic_type" in sdo) {
                if (this.isStringArray(sdo.x_mitre_tactic_type)) this.tactic_type = sdo.x_mitre_tactic_type;
                else logger.error("TypeError: tactic types field is not a string array.");
            } else this.tactic_type = [];

            if ("x_mitre_permissions_required" in sdo) {
                if (this.isStringArray(sdo.x_mitre_permissions_required)) this.permissions_required = sdo.x_mitre_permissions_required;
                else logger.error("TypeError: permissions required field is not a string array.");
            } else this.permissions_required = [];

            if ("x_mitre_defense_bypassed" in sdo) {
                if (this.isStringArray(sdo.x_mitre_defense_bypassed)) this.defense_bypassed = sdo.x_mitre_defense_bypassed;
                else logger.error("TypeError: defense bypassed field is not a string array.");
            } else this.defense_bypassed = [];

            if ("x_mitre_is_subtechnique" in sdo) {
                if (typeof(sdo.x_mitre_is_subtechnique) === "boolean") this.is_subtechnique = sdo.x_mitre_is_subtechnique;
                else logger.error("TypeError: is subtechnique field is not a boolean:", sdo.x_mitre_is_subtechnique, "(", typeof(sdo.x_mitre_is_subtechnique),")")
            }

            if ("x_mitre_remote_support" in sdo) {
                if (typeof(sdo.x_mitre_remote_support) === "boolean") this.supports_remote = sdo.x_mitre_remote_support;
                else logger.error("TypeError: supports remote field is not a boolean:", sdo.x_mitre_remote_support, "(", typeof(sdo.x_mitre_remote_support),")")
            }

            if ("x_mitre_impact_type" in sdo) {
                if (this.isStringArray(sdo.x_mitre_impact_type)) this.impact_type = sdo.x_mitre_impact_type;
                else logger.error("TypeError: impact type field is not a string array.");
            }

            if ("x_mitre_effective_permissions" in sdo) {
                if (this.isStringArray(sdo.x_mitre_effective_permissions)) this.effective_permissions = sdo.x_mitre_effective_permissions;
                else logger.error("TypeError: effective permissions field is not a string array.");
            }

            if ("x_mitre_contributors" in sdo) {
                if (this.isStringArray(sdo.x_mitre_contributors)) this.contributors = sdo.x_mitre_contributors;
                else logger.error("TypeError: x_mitre_contributors is not a string array:", sdo.x_mitre_contributors, "(",typeof(sdo.x_mitre_contributors),")")
            } else this.contributors = [];

            if ("external_references" in sdo) {
                if (typeof(sdo.external_references) === "object") {
                    this.capec_ids = [];
                    this.mtc_ids = [];
                    for (let i = 0; i < sdo.external_references.length; i++){
                        if ("source_name" in sdo.external_references[i] && "external_id" in sdo.external_references[i]) {
                            if (typeof(sdo.external_references[i].external_id === "string")) {
                                if (sdo.external_references[i].source_name == "capec") this.capec_ids.push(sdo.external_references[i].external_id);
                                else if (sdo.external_references[i].source_name == "NIST Mobile Threat Catalogue") this.mtc_ids.push(sdo.external_references[i].external_id);
                            }
                            else logger.error("TypeError: external ID field is not a string: ", sdo.external_references[i].external_id, "(", typeof(sdo.external_references[i].external_id, ")"));
                        }
                    }
                }
                else logger.error("TypeError: external_references field is not an object:", sdo.external_references, "(",typeof(sdo.external_references),")")
            }
        }
    }

    /**
     * Validate the current object state and return information on the result of the validation
     * @param {RestApiConnectorService} restAPIService: the REST API connector through which asynchronous validation can be completed
     * @returns {Observable<ValidationData>} the validation warnings and errors once validation is complete.
     */
    public validate(restAPIService: RestApiConnectorService): Observable<ValidationData> {
        return this.base_validate(restAPIService).pipe(
            map(result => {
                // validate technique has at least one tactic
                if (this.attackID && this.tactics.length == 0) { // only check tactics if object is not a draft
                    result.errors.push({
                        "field": "tactics",
                        "result": "error",
                        "message": "object has no tactics"
                    });
                }

                // check CAPEC IDs
                let malformed_capec = this.capec_ids.filter(capec => !/^CAPEC-\d+$/.test(capec))
                if (malformed_capec.length > 0) result.errors.push({
                    "field": "external_references",
                    "result": "error",
                    "message": `CAPEC ID${malformed_capec.length > 1? 's' : ''} ${malformed_capec.join(", ")} do${malformed_capec.length == 1? 'es' : ''} not match format CAPEC-###`
                })

                // check MTC IDs
                let mtc_regex = new RegExp(`^(${Object.keys(this.mtcUrlMap).join("|")})-\\d+$`)
                let malformed_mtc = this.mtc_ids.filter(mtc => !mtc_regex.test(mtc));
                if (malformed_mtc.length > 0) result.errors.push({
                    "field": "external_references",
                    "result": "error",
                    "message": `MTC ID${malformed_mtc.length > 1? 's' : ''} ${malformed_mtc.join(", ")} do${malformed_mtc.length == 1? 'es' : ''} not match format [Threat Category]-###`
                })

                return result;
            }),
            switchMap(validationResult => {
                return forkJoin({
                    sub_of: restAPIService.getRelatedTo({sourceRef: this.stixID, relationshipType: "subtechnique-of"}),
                    super_of: restAPIService.getRelatedTo({targetRef: this.stixID, relationshipType: "subtechnique-of"})
                }).pipe(
                    map(relationships => {
                        if (this.is_subtechnique && relationships.super_of.data.length > 0) validationResult.errors.push({
                            "field": "is_subtechnique",
                            "result": "error",
                            "message": "technique with sub-techniques cannot be converted to sub-technique"
                        })
                        if (!this.is_subtechnique && relationships.sub_of.data.length > 0) validationResult.errors.push({
                            "field": "is_subtechnique",
                            "result": "error",
                            "message": "sub-technique with parent cannot be converted to technique"
                        })
                        return validationResult;
                    })
                )
            })
        );
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restAPIService: RestApiConnectorService): Observable<Technique> {
        // TODO POST if the object was just created (doesn't exist in db yet)

        let postObservable = restAPIService.postTechnique(this);
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
        let deleteObservable = restAPIService.deleteTechnique(this.stixID);
        let subscription = deleteObservable.subscribe({
            complete: () => { subscription.unsubscribe(); }
        });
        return deleteObservable;
    }
}
