import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            headers: this.headers,
            withCredentials: true
        });
        return next.handle(request);
    }
}
