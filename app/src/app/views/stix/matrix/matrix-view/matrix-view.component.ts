import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { StixViewPage } from '../../stix-view-page';
import { ActivatedRoute } from '@angular/router';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Observable } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-matrix-view',
  templateUrl: './matrix-view.component.html',
  styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent extends StixViewPage implements OnInit {

  public editing: boolean = false;

  //tactics to render;
  public tactics$: Observable<StixObject[]>;

  public matrix: Matrix = new Matrix({
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5", 
    "name": "Enterprise ATT&CK", 
    "created": "2018-10-17T00:14:20.652Z", 
    "x_mitre_collections": [
        "x_mitre_collection--11c94726-c9dd-4660-b5f1-f8169e2604e1"
    ], 
    "x_mitre_domains": [
        "enterprise"
    ], 
    "spec_version": "2.1", 
    "modified": "2019-04-16T21:39:18.247Z", 
    "tactic_refs": [
        "x-mitre-tactic--29ecac6d-3a54-4a73-b858-604ac8848440",
        "x-mitre-tactic--6fd89420-f596-4ec2-aeb0-69ffa1081c26"
    ], 
    "object_marking_refs": [
        "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
    ], 
    "external_references": [
        {
            "url": "https://attack.mitre.org/matrices/enterprise", 
            "external_id": "enterprise-attack", 
            "source_name": "mitre-attack"
        }
    ], 
    "x_mitre_version": "1.0", 
    "type": "x-mitre-matrix", 
    "id": "x-mitre-matrix--eafc1b4c-5e56-4965-bd4e-66a6a89c88cc", 
    "description": "The full ATT&CK Matrix includes techniques spanning Windows, Mac, and Linux platforms and can be used to navigate through the knowledge base."
  })

  constructor(private route: ActivatedRoute, private restAPIConnectorService: RestApiConnectorService) { 
    super();
    this.tactics$ = this.restAPIConnectorService.getAllTactics(); //TODO add limit and offset once back-end supports it
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.editing = params["editing"];
    });
  }

}
