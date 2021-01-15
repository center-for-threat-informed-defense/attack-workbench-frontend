import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Tactic } from 'src/app/classes/stix/tactic';

@Component({
  selector: 'app-technique-view',
  templateUrl: './technique-view.component.html',
  styleUrls: ['./technique-view.component.scss']
})
export class TechniqueViewComponent extends StixViewPage implements OnInit {

    public editing: boolean = false;

    public technique: Technique = new Technique(
        {
            "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
            "name": "Clear Command History", 
            "created": "2017-12-14T16:46:06.044Z", 
            "x_mitre_platforms": [
                "Linux", 
                "macOS"
            ], 
            "type": "attack-pattern", 
            "x_mitre_domains": [
                "enterprise"
            ], 
            "x_mitre_remote_support": true, 
            "kill_chain_phases": [
                {
                    "phase_name": "defense-evasion", 
                    "kill_chain_name": "mitre-attack"
                }
            ], 
            "modified": "2019-07-16T20:37:57.409Z", 
            "x_mitre_detection": "User authentication, especially via remote terminal services like SSH, without new entries in that user's <code>~/.bash_history</code> is suspicious. Additionally, the modification of the HISTFILE and HISTFILESIZE environment variables or the removal/clearing of the <code>~/.bash_history</code> file are indicators of suspicious activity.", 
            "spec_version": "2.1", 
            "object_marking_refs": [
                "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
            ], 
            "external_references": [
                {
                    "url": "https://attack.mitre.org/techniques/T1146", 
                    "source_name": "mitre-attack", 
                    "external_id": "T1146"
                }
            ], 
            "x_mitre_collections": [
                "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
            ], 
            "x_mitre_defense_bypassed": [
                "Log analysis", 
                "Host forensic analysis"
            ], 
            "x_mitre_version": "1.0", 
            "x_mitre_data_sources": [
                "Authentication logs", 
                "File monitoring"
            ], 
            "id": "attack-pattern--d3046a90-580c-4004-8208-66915bc29830", 
            "description": "macOS and Linux both keep track of the commands users type in their terminal so that users can easily remember what they've done. These logs can be accessed in a few different ways. While logged in, this command history is tracked in a file pointed to by the environment variable <code>HISTFILE</code>. When a user logs off a system, this information is flushed to a file in the user's home directory called <code>~/.bash_history</code>. The benefit of this is that it allows users to go back to commands they've used before in different sessions. Since everything typed on the command-line is saved, passwords passed in on the command line are also saved. Adversaries can abuse this by searching these files for cleartext passwords. Additionally, adversaries can use a variety of methods to prevent their own commands from appear in these logs such as <code>unset HISTFILE</code>, <code>export HISTFILESIZE=0</code>, <code>history -c</code>, <code>rm ~/.bash_history</code>."
        }
    )

    public mitigations: Relationship[] = [
        new Relationship(
            {
                "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
                "x_mitre_domains": [
                    "enterprise"
                ], 
                "created": "2017-05-31T21:33:27.026Z", 
                "x_mitre_collections": [
                    "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
                ], 
                "spec_version": "2.1", 
                "modified": "2019-07-24T14:13:23.722Z", 
                "target_ref": "attack-pattern--5909f20f-3c39-4795-be06-ef1ea40d350b", 
                "object_marking_refs": [
                    "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
                ], 
                "relationship_type": "mitigates", 
                "x_mitre_version": "1.0", 
                "type": "relationship", 
                "id": "relationship--483a70b9-eae9-4d5f-925c-95c2dd7b9fa5", 
                "source_ref": "course-of-action--beb45abb-11e8-4aef-9778-1f9ac249784f"
            }
        )
    ];

    public subtechniques: Relationship[];
    public groups: Relationship[];
    public software: Relationship[];

    constructor(private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });

        // GET RELATIONSHIPS FUNCTIONS NOT YET IMPLEMENTED
        // this.subtechniques = this.technique.getRelationships('subtechnique-of');
        // this.mitigations = this.technique.getRelationshipsFrom('course-of-action', 'mitigates');
        // this.groups = this.technique.getRelationshipsFrom('intrusion-set', 'uses');
        // this.software = this.technique.getRelationshipsFrom('malware', 'uses').concat(
        //                 this.technique.getRelationshipsFrom('tool', 'uses'));
    }
}
