import { forkJoin, Observable, of } from "rxjs";
import { concatMap, map, shareReplay, switchMap } from "rxjs/operators";
import { RestApiConnectorService } from "src/app/services/connectors/rest-api/rest-api-connector.service";
import { ValidationData } from "../serializable";
import { StixObject } from "./stix-object";
import { logger } from "../../utils/logger";
import { Relationship } from "./relationship";

export class Technique extends StixObject {
    public name: string = "";
    public kill_chain_phases: any[] = [];
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
    public set tactics(values: any[]) {
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
                        // validate technique <-> sub-technique conversion
                        if (this.is_subtechnique && relationships.super_of.data.length > 0) validationResult.errors.push({
                            "field": "is_subtechnique",
                            "result": "error",
                            "message": "technique with sub-techniques cannot be converted to sub-technique"
                        });
                        if (!this.is_subtechnique && relationships.sub_of.data.length > 0) validationResult.errors.push({
                            "field": "is_subtechnique",
                            "result": "error",
                            "message": "sub-technique with parent cannot be converted to technique"
                        });

                        // added tactic syncing information
                        if (!this.is_subtechnique && relationships.super_of.data.length > 0) {
                            // sub-technique with assigned parent or parent with sub-techniques
                            validationResult.info.push({
                                "field": "tactics",
                                "result": "info",
                                "message": "sub-technique tactics will sync with parent technique"
                            })
                        }

                        return validationResult;
                    })
                )
            })
        );
    }

    private updateParentRelationship(restApiService: RestApiConnectorService): Observable<any> {
        if (this.is_subtechnique && this.parentTechnique) {
            // retrieve 'subtechnique-of' relationship, if any
            return restApiService.getRelatedTo({sourceRef: this.stixID, relationshipType: "subtechnique-of"}).pipe(
                switchMap(r => {
                    let createRelationship = function(source, target): Relationship {
                        // function to create a new 'subtechnique-of' relationship
                        // with the given source and target object
                        let newRelationship = new Relationship();
                        newRelationship.relationship_type = 'subtechnique-of';
                        newRelationship.set_source_object(source, restApiService);
                        newRelationship.set_target_object(target, restApiService);
                        return newRelationship;
                    };

                    let relationshipUpdates = [];

                    if (r.data.length > 0 && r.data[0]) {
                        // relationship exists, check if parent has changed
                        let relationship = r.data[0] as Relationship;
                        if (relationship.target_ref !== this.parentTechnique.stixID) {
                            // parent technique changed, revoke previous 'subtechnique-of'
                            // relationship and create a new one
                            relationship.revoked = true;
                            relationshipUpdates.push(relationship.save(restApiService));
                            const newRelationship = createRelationship(this, this.parentTechnique);
                            relationshipUpdates.push(newRelationship.save(restApiService));
                        } // otherwise parent has not changed, do nothing
                    } else {
                        // 'subtechnique-of' relationship does not exist, create a new one
                        const newRelationship = createRelationship(this, this.parentTechnique);
                        relationshipUpdates.push(newRelationship.save(restApiService));
                    }

                    return forkJoin(relationshipUpdates.length ? relationshipUpdates : [of(null)])
                })
            );
        } else {
            return of(null);
        }
    }

    private syncTacticsWithParentOrSubs(restApiService: RestApiConnectorService): Observable<any> {
        // case: sub-technique with assigned parent technique
        if (this.is_subtechnique && this.parentTechnique) {
            // sync this sub-technique's tactics with its parent
            return restApiService.getRelatedTo({sourceRef: this.stixID, relationshipType: 'subtechnique-of'}).pipe(
                switchMap(r => {
                    if (r.data.length > 0) {
                        let relationship = r.data[0] as Relationship;
                        return restApiService.getTechnique(relationship.target_ref, null, "latest").pipe(
                            switchMap(parentData => {
                                let parent: Technique = parentData?.[0];
                                if (parent && !this.killChainPhasesSynced(parent.kill_chain_phases, this.kill_chain_phases)) {
                                    // this sub-technique's tactics are not synced with its parent
                                    let parentTactics = parent.kill_chain_phases.map(kcp => [kcp.phase_name, this.killChainMap[kcp.kill_chain_name]])
                                    this.tactics = parentTactics;
                                    // the saving of this update occurs in the save() function and is not needed here
                                }
                                return of(null);
                            })
                        )
                    }
                    return of(null);
                })
            );
        }

        // case: sub-technique without assigned parent
        else if (this.is_subtechnique && !this.parentTechnique) return of(null);

        // case: parent technique, need to check if parent has sub-techniques
        else {
            // get any related "subtechnique-of" relationships, where the parent is this object (target_ref)
            return restApiService.getRelatedTo({targetRef: this.stixID, relationshipType: 'subtechnique-of'}).pipe(
                switchMap(r => {
                    // case: parent technique with sub-techniques
                    if (r.data.length > 0) {
                        // sync all sub-techniques' tactics with this object's tactics
                        const subtechniqueUpdates = r.data.map(sr => {
                            let subRelationship = sr as Relationship;
                            // get latest sub-technique object from relationship (source_ref)
                            return restApiService.getTechnique(subRelationship.source_ref, null, "latest").pipe(
                                switchMap(subData => {
                                    let subtechnique: Technique = subData?.[0];
                                    if (subtechnique && !this.killChainPhasesSynced(subtechnique.kill_chain_phases, this.kill_chain_phases)) {
                                        // sub-technique tactics are not synced with this parent
                                        let parentTactics = this.kill_chain_phases.map(kcp => {
                                            let killChainName = Object.keys(this.killChainMap).find(key => this.killChainMap[key] === kcp.kill_chain_name);
                                            return [kcp.phase_name, killChainName]
                                        })
                                        subtechnique.tactics = parentTactics;
                                        return restApiService.postTechnique(subtechnique); // NOTE: do not use subtechnique.save(restApiService)
                                    }
                                    // tactics already synced
                                    return of(null);
                                })
                            )
                        })
                        return forkJoin(subtechniqueUpdates);
                    }
                    // case: parent technique with no sub-techniques
                    return of(null);
                })
            )
        }
    }

    private killChainPhasesSynced(tacticsA: any[], tacticsB: any[]) {
        if (tacticsA.length !== tacticsB.length) return false;

        // sort kcps to ensure a consistent order for comparison
        const sortedA = [...tacticsA].sort((a, b) => a.phase_name.localeCompare(b.phase_name));
        const sortedB = [...tacticsB].sort((a, b) => a.phase_name.localeCompare(b.phase_name));

        return sortedA.every((kcpA, i) => {
            let kcpB = sortedB[i];
            return kcpA.phase_name == kcpB.phase_name && kcpA.kill_chain_name == kcpB.kill_chain_name;
        })
    }

    /**
     * Save the current state of the STIX object in the database. Update the current object from the response
     * @param restAPIService [RestApiConnectorService] the service to perform the POST/PUT through
     * @returns {Observable} of the post
     */
    public save(restApiService: RestApiConnectorService) : Observable<Technique> {
        const postObservable = this.updateParentRelationship(restApiService).pipe(
            concatMap(() => this.syncTacticsWithParentOrSubs(restApiService)),
            concatMap(() => restApiService.postTechnique(this)),
            shareReplay(1) // share the result and ensure only the last POST result is emitted
        );

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

    /**
     * Update the state of the STIX object in the database.
     * @param restAPIService [RestApiConnectorService] the service to perform the PUT through
     * @returns {Observable} of the put
     */
    public update(restAPIService: RestApiConnectorService) : Observable<Technique> {
        let putObservable = restAPIService.putTechnique(this);
        let subscription = putObservable.subscribe({
            next: (result) => { this.deserialize(result.serialize()); },
            complete: () => { subscription.unsubscribe(); }
        });
        return putObservable;
    }
}
