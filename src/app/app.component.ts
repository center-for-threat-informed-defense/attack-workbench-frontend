import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { getCookie, hasCookie, setCookie } from './utils/cookies';
import { SidebarService } from './services/sidebar/sidebar.service';
import { NGXLogger } from 'ngx-logger';
import { initLogger } from './utils/logger';
import { AuthenticationService } from './services/connectors/authentication/authentication.service';
import { NavigationEnd, Router } from '@angular/router';
import { EditorService } from './services/editor/editor.service';
import { Theme } from './utils/globals';
import { AppConfigService } from './services/config/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  // Drawer container to resize when contents change size
  @ViewChild(MatDrawerContainer, { static: true }) private container: MatDrawerContainer;

  // Elements for scroll behavior
  @ViewChild('header', { static: false, read: ElementRef }) private header: ElementRef;
  @ViewChild('scrollRef', { static: false, read: ElementRef }) private scrollRef: ElementRef;

  public theme;
  public alertStatus;
  public hiddenHeaderPX = 0; // number of px of the header which is hidden

  public get sidebarOpened() {
    return this.sidebarService.opened && this.editorService.sidebarEnabled;
  }

  constructor(
    private overlayContainer: OverlayContainer,
    private sidebarService: SidebarService,
    private authenticationService: AuthenticationService,
    private editorService: EditorService,
    private router: Router,
    private configService: AppConfigService,
    private logger: NGXLogger,
  ) {
    // Note: this isn't used directly, but it MUST be imported to work properly

    if (hasCookie('theme')) {
      this.setTheme(getCookie('theme'));
    } else {
      this.setDefaultTheme();
    }
    const routerSubscription = this.router.events.subscribe({
      next: (e) => {
        if (e instanceof NavigationEnd && e.url.includes('register')) {
          const registerSubscription = this.authenticationService
            .handleRegisterRedirect()
            .subscribe({
              next: () => {
                this.router.navigate(['']);
              },
              complete: () => {
                registerSubscription.unsubscribe();
              },
            });
        } else if (e instanceof NavigationEnd) {
          const authSubscription = this.authenticationService.getSession().subscribe({
            next: (res) => {
              this.checkStatus();
            },
            complete: () => {
              authSubscription.unsubscribe();
            },
          });
        }
      },
      complete: () => {
        routerSubscription.unsubscribe();
      },
    });
    initLogger(logger);
  }

  ngAfterViewInit(): void {
    // header hiding with scroll
    this.scrollRef.nativeElement.addEventListener(
      'scroll',
      (e) => this.adjustHeaderPlacement(),
      true,
    );
    // to fix rare cases that the page has resized without scroll events triggering, recompute the offset every 5 seconds
    setInterval(() => this.adjustHeaderPlacement(), 5000);
  }

  ngOnDestroy(): void {
    this.scrollRef.nativeElement.removeEventListener(
      'scroll',
      (e) => this.adjustHeaderPlacement(),
      true,
    );
  }

  /**
   * Check the account status of the logged in user.
   * If the user's account status is not active, an alert
   * banner is displayed and the user is logged out.
   */
  public checkStatus(): void {
    if (this.authenticationService.currentUser) {
      const status = this.authenticationService.currentUser.status;
      if (status != 'active') {
        this.alertStatus = status;
        this.logout();
      }
    }
  }

  // User log in
  public login(): void {
    const loginSubscription = this.authenticationService.login().subscribe({
      next: () => {
        this.checkStatus();
      },
      complete: () => {
        loginSubscription.unsubscribe();
      },
    });
  }

  // User log out
  public logout(): void {
    const logoutSubscription = this.authenticationService.logout().subscribe({
      complete: () => {
        this.sidebarService.opened = false;
        this.router.navigate(['']);
        logoutSubscription.unsubscribe();
      },
    });
  }

  // User registration
  public register(): void {
    const sub = this.authenticationService.register().subscribe({
      complete: () => {
        sub.unsubscribe();
      },
    });
  }

  // Toggle the current theme
  public toggleTheme(): void {
    this.setTheme(this.theme == Theme.LightMode ? Theme.DarkMode : Theme.LightMode);
  }

  // Set the initial/default theme based on the operating system/browser settings
  public setDefaultTheme(): void {
    // The theme property will be set to 'dark' if the operating system or browser is in dark mode, and 'light' if
    // it is in light mode
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    this.theme = mediaQueryList.matches ? Theme.DarkMode : Theme.LightMode;
    this.setThemeOnOverlayContainerElement();

    // use the addEventListener method of the MediaQueryList object to set up a listener that will be called
    // whenever the light/dark mode setting changes
    mediaQueryList.addEventListener('change', (event) => {
      if (hasCookie('theme')) {
        // User has set the theme using the app's toggle button, ignore changes in system/browser mode
      } else {
        this.theme = event.matches ? Theme.DarkMode : Theme.LightMode;
        this.setThemeOnOverlayContainerElement();
      }
    });
  }

  public setTheme(theme: string): void {
    this.logger.log(`Setting theme to ${theme}`);
    this.theme = theme;
    this.setThemeOnOverlayContainerElement();
    setCookie('theme', theme, 30);
  }

  private setThemeOnOverlayContainerElement(): void {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    overlayContainerClasses.remove(Theme.DarkMode, Theme.LightMode);
    overlayContainerClasses.add(this.theme);
  }

  // adjust the header placement
  private adjustHeaderPlacement(): void {
    const headerHeight = this.header.nativeElement.offsetHeight;
    // constrain amount of hidden to bounds, round up because decimal scroll causes flicker
    this.hiddenHeaderPX = Math.floor(
      Math.min(Math.max(0, this.scrollRef.nativeElement.scrollTop / 2), headerHeight),
    );
  }

  // scroll to the top of the main content
  public scrollToTop(): void {
    this.scrollRef.nativeElement.scroll({ top: 0, behavior: 'smooth' });
  }
}
