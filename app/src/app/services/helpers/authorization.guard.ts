import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../connectors/authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authenticationService: AuthenticationService) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // check if user is logged in
        if (!this.authenticationService.isLoggedIn) {
            this.router.navigate(['']);
            return false;
        }
        // check if route is restricted by role
        if (route.data.roles && !this.authenticationService.isAuthorized(route.data.roles)) {
            this.router.navigate(['']);
            return false;
        }
        // check if route is editable
        if (route.data.editable && route.queryParams.editing == 'true' && !this.authenticationService.canEdit) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(childRoute, state);
    }
}
