import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, share, map, concatMap } from 'rxjs/operators';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { environment } from "../../../../environments/environment";
import { ApiConnector } from '../api-connector';
import { Role } from 'src/app/classes/authn/role';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiConnector {
    public currentUser: UserAccount = undefined;

    private get baseUrl(): string { return environment.integrations.rest_api.url; }
    private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private http: HttpClient, private snackbar: MatSnackBar) { super(snackbar); }

    public isAuthorized(roles: Role[]): boolean {
        if (!this.currentUser) return false;
        return roles.indexOf(this.currentUser.role) > -1;
    }

    public isLoggedIn(): boolean {
        return this.currentUser !== undefined && this.currentUser.status == 'active';
    }

    public login(): Observable<UserAccount> {
        return this.getAuthType().pipe(
            concatMap(authnType => {
                let url = `${this.baseUrl}/authn/${authnType}/login`;
                return this.http.get<UserAccount>(url, {headers: this.headers}).pipe(
                    map(results => {
                        this.currentUser = results as UserAccount;
                        return results;
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
                return this.http.get<any>(url, {headers: this.headers}).pipe(
                    map(results => {
                        this.currentUser = undefined;
                        return results;
                    })
                );
            }),
            catchError(this.handleError_raise<{}>()),
            share()
        )
    }

    public getSession(): Observable<UserAccount> {
        let url = `${this.baseUrl}/session`;
        return this.http.get<UserAccount>(url, {headers: this.headers}).pipe(
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
        return this.http.get<any>(url, {headers: this.headers}).pipe(
            map(results => {
                if (results.mechanisms) {
                    let authnMechanism = results.mechanisms.find(m => m.authnType);
                    if (authnMechanism && authnMechanism.authnType) {
                        return authnMechanism.authnType;
                    }
                }
                return 'anonymous';
            }),
            catchError(this.handleError_continue<string>('anonymous')),
            share()
        );
    }
}
