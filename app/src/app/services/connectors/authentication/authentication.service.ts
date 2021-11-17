import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, share, map, concatMap, tap } from 'rxjs/operators';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';
import { Role } from 'src/app/classes/authn/role';
import { logger } from "../../../util/logger";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiConnector {
    public currentUser: UserAccount;
    public get isLoggedIn(): boolean { return this.currentUser && this.currentUser.status == 'active'; }
    private get baseUrl(): string { return environment.integrations.rest_api.url; }

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { super(snackbar); }

    public isAuthorized(roles: Role[]): boolean {
        // is user logged in?
        if (!this.isLoggedIn) return false;
        // does user have an authorized role?
        return roles.indexOf(this.currentUser.role) > -1;
    }

    public login(): Observable<UserAccount> {
        return this.getAuthType().pipe(
            concatMap(authnType => {
                let url = `${this.baseUrl}/authn/${authnType}/login`;
                return this.http.get(url, {responseType: 'text'}).pipe( // login endpoint call
                    concatMap(success => {
                        return this.getSession().pipe(
                            tap(res => logger.log('successfully logged in')),
                            map(res => { return res; })
                        );
                    })
                );
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
                    tap(res => logger.log('succesfully logged out')),
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

    public getSession(): Observable<UserAccount> {
        let url = `${this.baseUrl}/session`;
        return this.http.get<UserAccount>(url).pipe(
            map(user => {
                this.currentUser = new UserAccount(user);
                return user;
            }),
            catchError(err => of(new UserAccount())), // return a default value so that the app can continue
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
