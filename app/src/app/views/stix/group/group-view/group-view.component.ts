import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/classes/stix/group';
import { StixViewPage } from '../../stix-view-page';
import { Relationship } from 'src/app/classes/stix/relationship';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends StixViewPage implements OnInit {
  
  public editing: boolean = false;
  public group: Group = new Group({
    "type": "intrusion-set", 
    "id": "intrusion-set--4ca1929c-7d64-4aab-b849-badbfc0c760d", 
    "name": "OilRig",
    "description": "[OilRig](https://attack.mitre.org/groups/G0049) is a suspected Iranian threat group that has targeted Middle Eastern and international victims since at least 2014. The group has targeted a variety of industries, including financial, government, energy, chemical, and telecommunications, and has largely focused its operations within the Middle East. It appears the group carries out supply chain attacks, leveraging the trust relationship between organizations to attack their primary targets. FireEye assesses that the group works on behalf of the Iranian government based on infrastructure details that contain references to Iran, use of Iranian infrastructure, and targeting that aligns with nation-state interests. (Citation: Palo Alto OilRig April 2017) (Citation: ClearSky OilRig Jan 2017) (Citation: Palo Alto OilRig May 2016) (Citation: Palo Alto OilRig Oct 2016) (Citation: Unit 42 Playbook Dec 2017) (Citation: FireEye APT34 Dec 2017)(Citation: Unit 42 QUADAGENT July 2018) This group was previously tracked under two distinct groups, APT34 and OilRig, but was combined due to additional reporting giving higher confidence about the overlap of the activity.", 
    "created": "2017-12-14T16:46:06.044Z", 
    "modified": "2019-10-15T17:48:09.182Z", 
    "spec_version": "2.1", 
    "x_mitre_domains": [
        "enterprise"
    ], 
    "x_mitre_contributors": [
        "Robert Falcone", 
        "Bryan Lee",
        "Hubert Jogn"
    ], 
    "object_marking_refs": [
        "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ], 
    "external_references": [
        {
            "url": "https://attack.mitre.org/groups/G0049", 
            "source_name": "mitre-attack", 
            "external_id": "G0049 ea gae geagaegaegaemg eafjawe dfaefjeag eagjaeig aeg aegjsg ojgwerafhaweghag eaighuawhuiegh gge ag gweg wege wgewg wegwegwe"
        }, 
        {
            "source_name": "OilRig", 
            "description": "(Citation: Palo Alto OilRig April 2017) (Citation: ClearSky OilRig Jan 2017) (Citation: Palo Alto OilRig May 2016) (Citation: Palo Alto OilRig Oct 2016) (Citation: Unit 42 Playbook Dec 2017) (Citation: Unit 42 QUADAGENT July 2018)"
        }, 
        {
            "source_name": "IRN2", 
            "description": "(Citation: Crowdstrike Helix Kitten Nov 2018)"
        }, 
        {
            "source_name": "HELIX KITTEN", 
            "description": "(Citation: Unit 42 QUADAGENT July 2018)(Citation: Crowdstrike Helix Kitten Nov 2018)"
        }, 
        {
            "source_name": "APT34", 
            "description": "This group was previously tracked under two distinct groups, APT34 and OilRig, but was combined due to additional reporting giving higher confidence about the overlap of the activity. (Citation: Unit 42 QUADAGENT July 2018) (Citation: FireEye APT34 Dec 2017)"
        }, 
        {
            "url": "http://researchcenter.paloaltonetworks.com/2017/04/unit42-oilrig-actors-provide-glimpse-development-testing-efforts/", 
            "source_name": "Palo Alto OilRig April 2017", 
            "description": "Falcone, R.. (2017, April 27). OilRig Actors Provide a Glimpse into Development and Testing Efforts. Retrieved May 3, 2017."
        }, 
        {
            "url": "http://www.clearskysec.com/oilrig/", 
            "source_name": "ClearSky OilRig Jan 2017", 
            "description": "ClearSky Cybersecurity. (2017, January 5). Iranian Threat Agent OilRig Delivers Digitally Signed Malware, Impersonates University of Oxford. Retrieved May 3, 2017."
        }, 
        {
            "url": "http://researchcenter.paloaltonetworks.com/2016/05/the-oilrig-campaign-attacks-on-saudi-arabian-organizations-deliver-helminth-backdoor/", 
            "source_name": "Palo Alto OilRig May 2016", 
            "description": "Falcone, R. and Lee, B.. (2016, May 26). The OilRig Campaign: Attacks on Saudi Arabian Organizations Deliver Helminth Backdoor. Retrieved May 3, 2017."
        }, 
        {
            "url": "http://researchcenter.paloaltonetworks.com/2016/10/unit42-oilrig-malware-campaign-updates-toolset-and-expands-targets/", 
            "source_name": "Palo Alto OilRig Oct 2016", 
            "description": "Grunzweig, J. and Falcone, R.. (2016, October 4). OilRig Malware Campaign Updates Toolset and Expands Targets. Retrieved May 3, 2017."
        }, 
        {
            "url": "https://pan-unit42.github.io/playbook_viewer/", 
            "source_name": "Unit 42 Playbook Dec 2017", 
            "description": "Unit 42. (2017, December 15). Unit 42 Playbook Viewer. Retrieved December 20, 2017."
        }, 
        {
            "url": "https://www.fireeye.com/blog/threat-research/2017/12/targeted-attack-in-middle-east-by-apt34.html", 
            "source_name": "FireEye APT34 Dec 2017", 
            "description": "Sardiwal, M, et al. (2017, December 7). New Targeted Attack in the Middle East by APT34, a Suspected Iranian Threat Group, Using CVE-2017-11882 Exploit. Retrieved December 20, 2017."
        }, 
        {
            "url": "https://researchcenter.paloaltonetworks.com/2018/07/unit42-oilrig-targets-technology-service-provider-government-agency-quadagent/", 
            "source_name": "Unit 42 QUADAGENT July 2018", 
            "description": "Lee, B., Falcone, R. (2018, July 25). OilRig Targets Technology Service Provider and Government Agency with QUADAGENT. Retrieved August 9, 2018."
        }, 
        {
            "url": "https://www.crowdstrike.com/blog/meet-crowdstrikes-adversary-of-the-month-for-november-helix-kitten/", 
            "source_name": "Crowdstrike Helix Kitten Nov 2018", 
            "description": "Meyers, A. (2018, November 27). Meet CrowdStrike\u2019s Adversary of the Month for November: HELIX KITTEN. Retrieved December 18, 2018."
        }
    ], 
    "x_mitre_collections": [
        "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
    ], 
    "x_mitre_version": "1.2", 
    "aliases": [
        "OilRig", 
        "IRN2", 
        "HELIX KITTEN", 
        "APT34"
    ], 
  })

  public relationships_techniques: Relationship[] = [new Relationship({
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
    "object_marking_refs": ["marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"],
    "external_references": [{
        "description": "Carr, N, et all. (2019, October 10). Mahalo FIN7: Responding to the Criminal Operators' New Tools and Techniques. Retrieved October 11, 2019.",
        "url": "https://www.fireeye.com/blog/threat-research/2019/10/mahalo-fin7-responding-to-new-tools-and-techniques.html",
        "source_name": "FireEye FIN7 Oct 2019"
    }],
    "description": "[RDFSNIFFER](https://attack.mitre.org/software/S0416) hooks several Win32 API functions to hijack elements of the remote system management user-interface.(Citation: FireEye FIN7 Oct 2019)",
    "id": "relationship--71a3a771-3674-4b44-8742-bed627f178b3",
    "type": "relationship",
    "modified": "2019-10-11T16:13:19.711Z",
    "created": "2019-10-11T16:13:19.711Z",
    "source_ref": "malware--065196de-d7e8-4888-acfb-b2134022ba1b",
    "source_name": "RDFSNIFFER", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    "relationship_type": "uses",
    "target_ref": "attack-pattern--f5946b5e-9408-485f-a7f7-b5efc88909b6",
    "target_name": "Input Capture: Credential API Hooking" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
  })]

  public relationships_software: Relationship[] = [new Relationship({
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
    "external_references": [
        {
            "url": "https://www.fireeye.com/blog/threat-research/2019/04/pick-six-intercepting-a-fin6-intrusion.html", 
            "source_name": "FireEye FIN6 Apr 2019", 
            "description": "McKeague, B. et al. (2019, April 5). Pick-Six: Intercepting a FIN6 Intrusion, an Actor Recently Tied to Ryuk and LockerGoga Ransomware. Retrieved April 17, 2019."
        }
    ], 
    "created": "2019-04-17T14:45:59.674Z", 
    "x_mitre_collections": [
        "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
    ], 
    "x_mitre_domains": [
        "enterprise"
    ], 
    "spec_version": "2.1", 
    "modified": "2019-06-28T14:59:17.854Z", 
    "target_ref": "tool--aafea02e-ece5-4bb2-91a6-3bf8c7f38a39", 
    "object_marking_refs": [
        "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ], 
    "relationship_type": "uses", 
    "x_mitre_version": "1.0", 
    "type": "relationship", 
    "id": "relationship--935681a5-d027-4c13-8565-54cd8505bf61", 
    "source_ref": "intrusion-set--2a7914cf-dff3-428d-ab0f-1014d1c28aeb",
    "source_name": "OilRig", // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
    "target_name": "Cobalt Strike" // THIS IS NOT PART OF THE SPEC, AND IS A PLACEHOLDER
  })]


  constructor(private route: ActivatedRoute) { 
    super()
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.editing = params["editing"];
    });
  }

}
