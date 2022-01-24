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

    constructor() {
        // intentionally left blank
    }

    // intercept outgoing requests to include headers & credentials
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const excludeCredentials = request.headers.get('SkipInterceptor');
        const newHeaders = excludeCredentials ? request.headers.delete('SkipInterceptor') : this.headers;
        request = request.clone({
            headers: newHeaders,
            withCredentials: excludeCredentials ? false : true
        })
        return next.handle(request);
    }
}
