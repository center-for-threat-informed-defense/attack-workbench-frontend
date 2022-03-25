import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, share, map, concatMap } from 'rxjs/operators';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';
import { Role } from 'src/app/classes/authn/role';
import { Router } from '@angular/router';
import { RestApiConnectorService } from '../rest-api/rest-api-connector.service';
import { Status } from 'src/app/classes/authn/status';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiConnector {
    public currentUser: UserAccount;
    public get isLoggedIn(): boolean { return this.currentUser && this.currentUser.status == Status.ACTIVE; }
    private get baseUrl(): string { return environment.integrations.rest_api.url; }
    public onLogin = new EventEmitter(); // event emitter for admin organization identity pop-up

    constructor(private router: Router, private http: HttpClient, snackbar: MatSnackBar, private restAPIConnector: RestApiConnectorService) { super(snackbar); }

    /**
     * Check if user is authorized
     * @param roles list of authorized roles
     * @returns true, if user is logged in and has an authorized role, false otherwise
     */
    public isAuthorized(roles: Role[]): boolean {
        // is user logged in?
        if (!this.isLoggedIn) return false;
        // does user have an authorized role?
        return roles.indexOf(this.currentUser.role) > -1;
    }

    /**
     * Check if user is authorized to edit an object
     * @param attackType object type
     * @returns true, if the user can edit the object, false otherwise
     */
    public canEdit(attackType?: string): boolean {
        if (attackType && attackType.includes('collection')) {
            // restrict collection editing to admin only
            return this.isAuthorized([Role.ADMIN]);
        }
        return this.isAuthorized([Role.EDITOR, Role.ADMIN])
    }

    /**
     * User log in sequence
     * @returns of the logged in user account
     */
    public login(): Observable<UserAccount> {
        return this.getAuthType().pipe(
            // retrieve authentication configuration
            concatMap(authnType => {
                let url = `${this.baseUrl}/authn/${authnType}/login`;
                if (authnType == "oidc") {
                    // oidc login
                    url += `?destination=${encodeURIComponent(window.location.href)}`;
                    // redirect to OIDC Identity Provider
                    window.location.href = url;
                    return this.getSession().pipe(
                        map(res => {
                            this.onLogin.emit();
                            return res;
                        })
                    );
                }
                // anonymous login
                return this.http.get(url, {responseType: 'text'}).pipe(
                    concatMap(success => {
                        return this.getSession().pipe(
                            map(res => {
                                this.onLogin.emit();
                                return res;
                            })
                        );
                    })
                );
            }),
            catchError(this.handleError_raise<UserAccount>()),
            share()
        );
    }

    /**
     * User logout sequence to clear the active login session on the REST API side
     * Note: this does not log the user out of the organization's SSO Provider
     * @returns of the log out response
     */
    public logout(): Observable<any> {
        return this.getAuthType().pipe(
            concatMap(authnType => {
                let url = `${this.baseUrl}/authn/${authnType}/logout`;
                return this.http.get(url, {responseType: 'text'}).pipe(
                    map(res => {
                        this.currentUser = undefined;
                        return res;
                    })
                );
            }),
            catchError(this.handleError_raise()),
            share()
        )
    }

    /**
     * User register sequence
     * @returns of the logged in user account
     */
    public register() {
        return this.getAuthType().pipe(
            // retrieve authentication configuration
            concatMap(authnType => {
                if (authnType == "oidc") {
                    let url = `${this.baseUrl}/authn/${authnType}/login`;
                    // oidc login
                    url += `?destination=${encodeURIComponent(window.location.href+'register')}`;
                    // redirect to OIDC Identity Provider
                    window.location.href = url;
                }
                return [].map(() => ({next: () => true}));
            }),
            catchError(this.handleError_raise<UserAccount>()),
            share()
        );
    }

    public handleRegisterRedirect(): Observable<any> {
        return this.getAuthType().pipe(
            // retrieve authentication configuration
            concatMap(authnType => {
                if (authnType == "oidc") {
                    return this.http.post(`${this.baseUrl}/user-accounts/register`, {responseType: 'text'}).pipe(
                        concatMap(() => {
                            return this.getSession().pipe(
                                map((res) => {
                                    return res;
                                })
                            );
                        })
                    );
                }
                return [].map(() => ({next: () => true}));
            }),
            catchError(this.handleError_raise<UserAccount>()),
            share()
        );
    }

    /**
     * Get the user account object of the logged in user
     * @returns the user account object of the logged in user, if logged in,
     * otherwise return a default value
     */
    public getSession(): Observable<UserAccount> {
        let url = `${this.baseUrl}/session`;
        // retrieve user session object
        return this.http.get<any>(url).pipe(
            concatMap(session => {
                // retrieve user account from session
                return this.restAPIConnector.getUserAccount(session.userAccountId).pipe(
                    map(res => {
                        this.currentUser = res;
                        return res;
                    })
                );
            }),
            catchError(err => { return of(null); }), // return a default value so that the app can continue
            share()
        )
    }

    /**
     * Get the authentication configuration
     * @returns the configured user authentication mechanism
     */
    public getAuthType(): Observable<string> {
        let url = `${this.baseUrl}/config/authn`;
        return this.http.get<any>(url).pipe(
            map(results => {
                if (results.mechanisms) {
                    let authnMechanism = results.mechanisms.find(m => m.authnType);
                    if (authnMechanism && authnMechanism.authnType) {
                        return authnMechanism.authnType;
                    }
                }
                else throw new Error("invalid authentication mechanism"); // this should never happen
            }),
            catchError(this.handleError_raise()),
            share()
        );
    }
}
