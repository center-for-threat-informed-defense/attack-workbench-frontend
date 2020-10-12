import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StixService } from '../stix.service';
import { Software } from 'src/app/classes/stix/software';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService extends StixService {

    private software: Software[] = [];

    constructor(private http: HttpClient) {
        super();
    }

    public get(stixID: string, refresh = false): Software {
        return this.software.filter((software) => software.stixID == stixID)[0];
    }

    public getAll(refresh = false): Software[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let software = data['objects'].filter((o) => o.type === 'malware' || o.type === 'tool');
            for(let sw of software) {
                let s = new Software(sw.type, sw);
                if(!this.software.some(o => o.stixID === s.stixID) ) {
                    this.software.push(s);
                }
            }
        });
        return this.software;
    }
}
