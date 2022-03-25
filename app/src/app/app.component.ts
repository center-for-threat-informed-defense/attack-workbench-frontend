import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { getCookie, setCookie, hasCookie } from "./util/cookies";
import { SidebarService } from './services/sidebar/sidebar.service';
import { NGXLogger } from 'ngx-logger';
import { initLogger } from './util/logger';
import { AuthenticationService } from './services/connectors/authentication/authentication.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    //drawer container to resize when contents change size
    @ViewChild(MatDrawerContainer, {static: true}) private container: MatDrawerContainer;
    //elements for scroll behavior
    @ViewChild("header", {static: false, read: ElementRef}) private header: ElementRef;
    @ViewChild("scrollRef", {static: false, read: ElementRef}) private scrollRef: ElementRef;

    public alertStatus;
    constructor(private overlayContainer: OverlayContainer,
                private sidebarService: SidebarService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private logger: NGXLogger) { //note: this isn't used directly, but it MUST be imported to work properly

        if (hasCookie("theme")) {
            this.setTheme(getCookie("theme"))
        } else {
            this.setTheme("light");
        }

        const routerSubscription = this.router.events.subscribe({
            next: (e) => {
                if (e instanceof NavigationEnd && e.url.includes('register')) {
                    const registerSubscription = this.authenticationService.handleRegisterRedirect().subscribe({
                        complete: () => { registerSubscription.unsubscribe(); }
                    }).add(() => {
                        this.router.navigate(['']);
                    });
                } else if (e instanceof NavigationEnd) {
                    // check user login
                    let authSubscription = this.authenticationService.getSession().subscribe({
                        next: (res) => { this.checkStatus(); },
                        complete: () => { authSubscription.unsubscribe(); }
                    });
                }
            }, complete: () => {
                routerSubscription.unsubscribe();
            }
        });
        initLogger(logger);
    }

    /**
     * Check the account status of the logged in user.
     * If the user's account status is not active, an alert
     * banner is displayed and the user is logged out.
     */
    public checkStatus(): void {
        if (this.authenticationService.currentUser) {
            let status = this.authenticationService.currentUser.status;
            if (status != "active") {
                this.alertStatus = status;
                this.logout();
            }
        }
    }

    // User log in
    public login(): void {
        const loginSubscription = this.authenticationService.login().subscribe({
            next: () => { this.checkStatus(); },
            complete: () => { loginSubscription.unsubscribe(); }
        });
    }

    // User log out
    public logout(): void {
        const logoutSubscription = this.authenticationService.logout().subscribe({
            complete: () => {
                this.sidebarService.opened = false;
                this.router.navigate(['']);
                logoutSubscription.unsubscribe();
            }
        });
    }

    // User registration
    public register(): void {
        const sub = this.authenticationService.register().subscribe({
            complete: () => {
                sub.unsubscribe();
            }
        });
    }

    public theme = "light";
    //toggle the current theme
    public toggleTheme() {
        this.setTheme(this.theme == "light"? "dark" : "light");
    }

    public setTheme(theme: string) {
        this.logger.log("setting theme to", theme);
        this.theme = theme;
        const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
        overlayContainerClasses.remove("dark", "light");
        overlayContainerClasses.add(this.theme);
        setCookie("theme", theme, 30);
    }

    // header hiding with scroll
    ngAfterViewInit() {
        this.scrollRef.nativeElement.addEventListener('scroll', (e) => this.adjustHeaderPlacement(), true);
        //to fix rare cases that the page has resized without scroll events triggering, recompute the offset every 5 seconds
        setInterval(() => this.adjustHeaderPlacement(), 5000);
    }
    ngOnDestroy() {
        this.scrollRef.nativeElement.removeEventListener('scroll', (e) => this.adjustHeaderPlacement(), true);
    }

    public hiddenHeaderPX: number = 0; //number of px of the header which is hidden
    // adjust the header placement
    private adjustHeaderPlacement(): void {
        let headerHeight = this.header.nativeElement.offsetHeight;
        // constrain amount of hidden to bounds, round up because decimal scroll causes flicker
        this.hiddenHeaderPX = Math.floor(Math.min(Math.max(0, this.scrollRef.nativeElement.scrollTop/2), headerHeight));
    }
    // scroll to the top of the main content
    public scrollToTop(): void {
        this.scrollRef.nativeElement.scroll({top: 0, behavior: "smooth"});
    }

    public get sidebarOpened() { return this.sidebarService.opened; }
}
