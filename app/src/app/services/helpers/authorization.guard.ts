import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../connectors/authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authenticationService: AuthenticationService) {}

    // determine if user has permissions to activate the requested route
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authenticationService.getSession().pipe(
            map(_ => {
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
                // user is authorized
                return true;
            })
        )
    }

    // determine if user has permissions to activate the requested child route
    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(childRoute, state);
    }
}
