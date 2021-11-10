import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/connectors/authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authenticationService: AuthenticationService, private location: Location) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authenticationService.currentUser;

        if (currentUser) {
            // check user status
            if (currentUser.status && currentUser.status !== "active") {
                this.location.back();
                return false;
            }

            // check if route is restricted by role
            if (route.data.roles && !this.authenticationService.isAuthorized(route.data.roles)) {
                // role not authorised
                this.location.back();
                return false;
            }

            // user is authorised
            return true;
        }

        // TODO user not logged in
        this.location.back();
        return false;
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // TODO
        return true;
    }
}
