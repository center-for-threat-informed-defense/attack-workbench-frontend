import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfig: any;

  /** Get the default landing page route */
  public get defaultLandingPage() {
    if (!this.appConfig) return '';
    return this.appConfig.defaultLandingPage;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // intentionally left blank
  }

  /**
   * helper function to redirect to the selected default page
   * redirects to standard landing page on error
   */
  public redirectToLanding(): void {
    if (this.defaultLandingPage && this.defaultLandingPage !== '') {
      this.router.navigate([this.defaultLandingPage]).catch(e => {
        this.router.navigate(['']);
      });
    } else {
      this.router.navigate(['']);
    }
  }

  /**
   * Initialize the app configuration settings
   */
  public loadAppConfig() {
    return this.http
      .get('/assets/config.json')
      .toPromise()
      .then(data => {
        console.debug(`Success: loaded app configuration settings`);
        this.appConfig = data;
      });
  }
}
