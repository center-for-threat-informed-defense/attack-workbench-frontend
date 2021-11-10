import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stixRoutes } from "../../app-routing-stix.module";
import * as app_package from "../../../../package.json";
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements AfterViewInit {
    public routes: any[];
    public app_version = app_package["version"];

    @ViewChild('linkMenu', {static: false})
    private linkMenu: ElementRef;

    constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService) {
        this.routes = stixRoutes;
    }

    ngAfterViewInit() {
        setTimeout(() => this.onResize(), 1000); //very hacky workaround: check menu size after 1 second to allow stuff to load
    }

    public showHamburger: boolean = false;

    @HostListener('window:resize', ['$event'])
    public onResize(event?: any) {
         //if the element overflows, show hamburger instead
        this.showHamburger = this.linkMenu.nativeElement.offsetWidth < this.linkMenu.nativeElement.scrollWidth;
    }

    public get isLoggedIn(): boolean { return this.authenticationService.isLoggedIn(); }

    public login(): void {
        let loginSubscription = this.authenticationService.login().subscribe({
            complete: () => { loginSubscription.unsubscribe(); }
        });
    }

    public logout(): void {
        let logoutSubscription = this.authenticationService.logout().subscribe({
            complete: () => { logoutSubscription.unsubscribe(); }
        })
    }
}
