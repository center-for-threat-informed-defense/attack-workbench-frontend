import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})

export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * helper function to redirect to the selected default page
   * redirects to standard landing page on error
   */
  redirectToLanding() {
    if (this.defaultLandingPage && this.defaultLandingPage!=='') {
      this.router.navigate([this.defaultLandingPage])
      .catch(e => {
        this.router.navigate(['/landing'])
      })
    } else {
      this.router.navigate(['/landing'])
    }

  }

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
      return 'landing';
    }
    return this.appConfig.defaultLandingPage;
  }
}
