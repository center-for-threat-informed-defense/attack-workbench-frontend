import { Injectable } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { RestApiConnectorService } from '../connectors/rest-api/rest-api-connector.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebsiteIntegrationService {
  // returns the actual integration url
  private get websiteIntegrationUrl(): string { return environment.integrations.attack_website.url; }
  // reads if the integration is enabled
  private get websiteIntegrationEnabled(): boolean { return environment.integrations.attack_website.enabled; }

  // route mapping based on type
  private typeToRouteMap = {
    'software': 'software',
    'matrix': 'matrices',
    'group': 'groups',
    'mitigation': 'mitigations',
    'tactic': 'tactics',
    'campaign': 'campaigns',
    'technique': 'techniques',
    'data-source': 'datasources',
  }

  // tracks the current URL, stixID, and validity of the URL
  currentWebIntegrationStatus: ExternalWebIntegrationStatus = {url:null,stixId:null,valid:false};
  
  constructor(private editorService:EditorService, private restAPIService: RestApiConnectorService) { }

  /**
   * Takes in a stixID and returns whether the external URL for that object would be valid
   * @param stixIdToCheck The stixID of the object we wish to check
   * @return {boolean}
   */
  public checkExternalUrlValidity(stixIdToCheck) {
    // if the integration is disabled, if the stixId passed in is not truthy, or if the stixId is 'new' we can auto-return false
    if (this.websiteIntegrationEnabled == false || !stixIdToCheck || stixIdToCheck == 'new') {
      this.currentWebIntegrationStatus = {url:null, valid: false, stixId: stixIdToCheck};
      return false;
    }
    // if the stixId matches the currently held stixId, no need to do the HTTP reqs
    if (this.currentWebIntegrationStatus.stixId == stixIdToCheck) {
      return this.currentWebIntegrationStatus.valid;
    }
    // set the stixId to the passed in stixId 
    this.currentWebIntegrationStatus = {url:null, valid: false, stixId: stixIdToCheck};
    // retrieve object based on type
    let data$: any;
    if (this.editorService.type == "software") data$ = this.restAPIService.getSoftware(stixIdToCheck);
    else if (this.editorService.type == "group") data$ = this.restAPIService.getGroup(stixIdToCheck);
    else if (this.editorService.type == "matrix") data$ = this.restAPIService.getMatrix(stixIdToCheck);
    else if (this.editorService.type == "mitigation") data$ = this.restAPIService.getMitigation(stixIdToCheck);
    else if (this.editorService.type == "tactic") data$ = this.restAPIService.getTactic(stixIdToCheck);
    else if (this.editorService.type == "campaign") data$ = this.restAPIService.getCampaign(stixIdToCheck);
    else if (this.editorService.type == "technique") data$ = this.restAPIService.getTechnique(stixIdToCheck);
    else if (this.editorService.type == "data-source") data$ = this.restAPIService.getDataSource(stixIdToCheck);
    else {
      return false;
    }
    // fetch the object from the REST API based on stixId
    let objSubscription = data$.subscribe({
        next: (data) => {
            // if data is not there, we can return false immediately
            if (data.length !== 1) {
              return false;
            }
            // grab attackObject and the attackID for the external lookup
            const attackObject = data[0];
            const attackID = attackObject.attackID.split('.');
            let additionalPath = '';
            // matrix type is special
            if (this.editorService.type == "matrix") {
              if (attackID == 'enterprise-attack') {
                additionalPath = '/enterprise/';
              } else if (attackID == 'mobile-attack') {
                additionalPath = '/mobile/';
              } else if (attackID == 'ics-attack') {
                additionalPath = '/ics/';
              } else {
                return false;
              }
            } else {
              // for sub-objects we need to split based on the '.' delimiter in the url
              for (let i = 0; i < attackID.length; i++) {
                additionalPath = additionalPath.concat('/',attackID[i]);
              }
            }
            const url = `${this.websiteIntegrationUrl}/${this.typeToRouteMap[this.editorService.type]}${additionalPath}`;
            this.currentWebIntegrationStatus.url = url;
            // with no-cors we will get no data but we can validate that the URL is valid
            fetch(url, {mode: 'no-cors'}).then(
              (response) => {
                this.currentWebIntegrationStatus.valid = true;
                return this.currentWebIntegrationStatus.valid;
              },
              (error) => {
                this.currentWebIntegrationStatus.valid = false;
                return this.currentWebIntegrationStatus.valid;
              }
            );
        },
        complete: () => { objSubscription.unsubscribe() }
    });
  }
}

interface ExternalWebIntegrationStatus {
  // the stixID that the validity and url are assocciated with
  stixId:string,
  // the external URL for the object with the given stixID
  url: string,
  // whether the externalURL is a valid URL
  valid:boolean,
};
