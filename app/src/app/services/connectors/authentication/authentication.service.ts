import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, share, map, concatMap, tap } from 'rxjs/operators';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';
import { Role } from 'src/app/classes/authn/role';
import { Router } from '@angular/router';
import { RestApiConnectorService } from '../rest-api/rest-api-connector.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiConnector {
    public currentUser: UserAccount;
    public get isLoggedIn(): boolean { return this.currentUser && this.currentUser.status == 'active'; }
    public get canEdit(): boolean { return this.isAuthorized([Role.Editor, Role.Admin]); }
    private get baseUrl(): string { return environment.integrations.rest_api.url; }
    public onLogin = new EventEmitter();

    constructor(private router: Router, private http: HttpClient, snackbar: MatSnackBar, private restAPIConnector: RestApiConnectorService) { super(snackbar); }

    public isAuthorized(roles: Role[]): boolean {
        // is user logged in?
        if (!this.isLoggedIn) return false;
        // does user have an authorized role?
        return roles.indexOf(this.currentUser.role) > -1;
    }

    public login(): Observable<any> {
        return this.getAuthType().pipe(
            concatMap(authnType => {
                let url = `${this.baseUrl}/authn/${authnType}/login`;
                if (authnType == "oidc") {
                    url += `?destination=${encodeURIComponent(window.location.href)}`;
                    window.location.href = url;
                    return of(url);
                } else {
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
                }
            }),
            catchError(this.handleError_raise<UserAccount>()),
            share()
        );
    }

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

    public getSession(): Observable<any> {
        let url = `${this.baseUrl}/session`;
        return this.http.get<any>(url).pipe(
            concatMap(session => { // retrieve user account
                return this.restAPIConnector.getUserAccount(session.userAccountId).pipe(
                    map(res => {
                        this.currentUser = res;
                        return res;
                    })
                );
            }),
            catchError(err => of({})), // return a default value so that the app can continue
            share()
        )
    }

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
                return 'anonymous';
            }),
            catchError(this.handleError_continue<string>('anonymous', false)), // default anonymous authentication
            share()
        );
    }
}
