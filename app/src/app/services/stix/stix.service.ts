import { Injectable } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})
export class StixService {
    public domainData = {
        "enterprise": "/assets/data/enterprise-attack-collection.json",
        "mobile": "/assets/data/mobile-attack-collection.json",
        "pre-attack": "/assets/data/pre-attack-collection.json"
    } 
    constructor() { }
    
    public get(stix_id: string, refresh?: boolean): StixObject {
        return null;
    };
    public getAll(): StixObject[] {
        return [];
    }
}
