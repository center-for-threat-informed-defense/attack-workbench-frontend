import { Injectable } from '@angular/core';
import { EditorService } from '../editor/editor.service';
import { RestApiConnectorService } from '../connectors/rest-api/rest-api-connector.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
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

  constructor(private editorService:EditorService, private restAPIService: RestApiConnectorService, private http: HttpClient) { }

  public checkUrlValidity() {
    if (this.websiteIntegrationStatus === false) {
      return false;
    }
    let data$: any;
    if (this.editorService.stixId && this.editorService.stixId != "new") { // don't load if the object doesn't exist yet
      // retrieve object
      if (this.editorService.type == "software") data$ = this.restAPIService.getSoftware(this.editorService.stixId);
      else if (this.editorService.type == "group") data$ = this.restAPIService.getSoftware(this.editorService.stixId);
      else if (this.editorService.type == "matrix") data$ = this.restAPIService.getMatrix(this.editorService.stixId);
      else if (this.editorService.type == "mitigation") data$ = this.restAPIService.getMitigation(this.editorService.stixId);
      else if (this.editorService.type == "tactic") data$ = this.restAPIService.getTactic(this.editorService.stixId);
      else if (this.editorService.type == "campaign") data$ = this.restAPIService.getCampaign(this.editorService.stixId);
      else if (this.editorService.type == "technique") data$ = this.restAPIService.getTechnique(this.editorService.stixId);
      else if (this.editorService.type == "data-source") data$ = this.restAPIService.getDataSource(this.editorService.stixId);
      else {return false}
      let objSubscription = data$.subscribe({
          next: (data) => {
              if (data.length !== 1) {
                return false;
              }
              console.log(data);
              const attackObject = data[0];
              const attackID = attackObject.attackID.split('.');
              let additionalPath = '';
              for (let i = 0; i < attackID.length; i++) {
                additionalPath = additionalPath.concat('/',attackID[i]);
              }
              const url = `${this.websiteIntegrationUrl}/${this.typeToRouteMap[this.editorService.type]}${additionalPath}`;
              const checkSubscription = this.http.get(url).subscribe({
                next: (response) => {
                  console.log(response);
                },
                error: (error) => {
                  console.log(error)
                },
                complete: () => {checkSubscription.unsubscribe}
              });
          },
          complete: () => { objSubscription.unsubscribe() }
      });
    }
  }
}
