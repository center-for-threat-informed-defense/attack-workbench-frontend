/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stixRoutes } from '../../app-routing-stix.module';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/classes/authn/role';
import * as globals from '../../utils/globals';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HeaderComponent implements AfterViewInit {
  public allRoutes: any[];
  public groupedRoutes: Record<string, any[]> = {};
  public filteredRoutes: any[] = [];
  public currentDropdown = null;
  public appVersion = globals.appVersion;

  @Output() public onLogin = new EventEmitter();
  @Output() public onLogout = new EventEmitter();
  @Output() public onRegister = new EventEmitter();
  authnTypeSubscription: Subscription;
  public authnType: string;

  public get isAdmin(): boolean {
    return this.authenticationService.isAuthorized([Role.ADMIN]);
  }
  public get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }
  public get username() {
    return this.authenticationService.currentUser.displayName
      ? this.authenticationService.currentUser.displayName
      : this.authenticationService.currentUser.username;
  }

  @ViewChild('linkMenu', { static: false })
  private linkMenu: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.allRoutes = stixRoutes;
    this.groupedRoutes = this.groupRoutesBySection(stixRoutes);
    this.filteredRoutes = this.groupedRoutes['none'] || [];
    delete this.groupedRoutes['none'];

    this.authnTypeSubscription = this.authenticationService
      .getAuthType()
      .subscribe({
        next: v => {
          this.authnType = v;
        },
        complete: () => {
          this.authnTypeSubscription.unsubscribe();
        },
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.onResize(), 1000); //very hacky workaround: check menu size after 1 second to allow stuff to load
  }

  public showHamburger = false;

  @HostListener('window:resize', ['$event'])
  public onResize(event?: any) {
    //if the element overflows, show hamburger instead
    this.showHamburger =
      this.linkMenu.nativeElement.offsetWidth <
      this.linkMenu.nativeElement.scrollWidth;
  }

  public login(): void {
    this.onLogin.emit();
  }

  public logout(): void {
    this.onLogout.emit();
  }

  public register(): void {
    this.onRegister.emit();
  }

  public groupRoutesBySection(routes: any[]): Record<string, any[]> {
    const grouped = {};
    routes.forEach(route => {
      const section = route.data.headerSection || 'none';
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(route);
    });
    return grouped;
  }

  public setSectionDropdown(section) {
    this.currentDropdown = section;
  }
}
