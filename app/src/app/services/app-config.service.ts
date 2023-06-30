import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return this.http.get('/assets/config.json')
    .toPromise()
    .then(data => {
      this.appConfig = data;
    });
  }
  /**
   * load the default landing page, which can be edited in config.json
   */
  get defaultLandingPage() {
    if (!this.appConfig) {
      return '';
    }
    return this.appConfig.defaultLandingPage;
  }
}
