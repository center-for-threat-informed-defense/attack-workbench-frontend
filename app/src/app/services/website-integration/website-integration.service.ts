import { Injectable } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { RestApiConnectorService } from '../connectors/rest-api/rest-api-connector.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebsiteIntegrationService {
  private get websiteIntegrationUrl(): string { return environment.integrations.attack_website.url; }
  private get websiteIntegrationStatus(): boolean { return environment.integrations.attack_website.enabled; }

  private typeToRouteMap = {
    'software': 'software',
    'matrix': 'matrices',
    'group': 'groups',
    'mitigation': 'mitigations',
    'tactic': 'mitigations',
    'campaign': 'tactics',
    'technique': 'techniques',
    'data-source': 'datasources',
  }

  currentWebIntegrationStatus: ExternalWebIntegrationStatus = {url:null,stixId:null,valid:false};
  
  constructor(private editorService:EditorService, private restAPIService: RestApiConnectorService) { }

  public checkExternalUrlValidity() {
    if (this.websiteIntegrationStatus == false) {
      this.currentWebIntegrationStatus = {url:null,stixId:null,valid:false};
      return this.currentWebIntegrationStatus.valid;
    }
    let data$: any;
    if (this.editorService.stixId) { 
      if (this.editorService.stixId == "new") {
        this.currentWebIntegrationStatus = {url:null,stixId:null,valid:false};
        return this.currentWebIntegrationStatus.valid;
      }
      if (this.editorService.stixId == this.currentWebIntegrationStatus.stixId) {
        return this.currentWebIntegrationStatus.valid;
      }
      // retrieve object
      if (this.editorService.type == "software") data$ = this.restAPIService.getSoftware(this.editorService.stixId);
      else if (this.editorService.type == "group") data$ = this.restAPIService.getSoftware(this.editorService.stixId);
      else if (this.editorService.type == "matrix") data$ = this.restAPIService.getMatrix(this.editorService.stixId);
      else if (this.editorService.type == "mitigation") data$ = this.restAPIService.getMitigation(this.editorService.stixId);
      else if (this.editorService.type == "tactic") data$ = this.restAPIService.getTactic(this.editorService.stixId);
      else if (this.editorService.type == "campaign") data$ = this.restAPIService.getCampaign(this.editorService.stixId);
      else if (this.editorService.type == "technique") data$ = this.restAPIService.getTechnique(this.editorService.stixId);
      else if (this.editorService.type == "data-source") data$ = this.restAPIService.getDataSource(this.editorService.stixId);
      else {
        this.currentWebIntegrationStatus = {url:null,stixId:null,valid:false};
        return this.currentWebIntegrationStatus.valid;
      }
      let objSubscription = data$.subscribe({
          next: (data) => {
              if (data.length !== 1) {
                this.currentWebIntegrationStatus = {url:null,stixId:null,valid:false};
                return this.currentWebIntegrationStatus.valid;
              }
              const attackObject = data[0];
              const attackID = attackObject.attackID.split('.');
              let additionalPath = '';
              if (this.editorService.type == "matrix") {
                if (attackID == 'enterprise-attack') {
                  additionalPath = '/enterprise/';
                } else if (attackID == 'mobile-attack') {
                  additionalPath = '/mobile';
                } else if (attackID == 'ics-attack') {
                  additionalPath = '/ics';
                }
              } else {
                for (let i = 0; i < attackID.length; i++) {
                  additionalPath = additionalPath.concat('/',attackID[i]);
                }
              }
              const url = `${this.websiteIntegrationUrl}/${this.typeToRouteMap[this.editorService.type]}${additionalPath}`;
              this.currentWebIntegrationStatus.url = url;
              this.currentWebIntegrationStatus.stixId = this.editorService.stixId;
              // with no-cors we will get no data but we can validate that the URL is valid
              fetch(url, {mode: 'no-cors'}).then(
                (response) => {
                  this.currentWebIntegrationStatus.valid = true;
                  return this.currentWebIntegrationStatus.valid;
                },
                (error) => {
                  this.currentWebIntegrationStatus.valid = true;
                  return this.currentWebIntegrationStatus.valid;
                }
              );
          },
          complete: () => { objSubscription.unsubscribe() }
      });
    }
  }
}

interface ExternalWebIntegrationStatus {
  stixId:string,
  url: string,
  valid:boolean,
};
