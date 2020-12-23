import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RestApiConnectorService {
    private get baseUrl(): string { return `${environment.integrations.rest_api.url}:${environment.integrations.rest_api.port}/api`; }

    constructor(private http: HttpClient) { }
}
