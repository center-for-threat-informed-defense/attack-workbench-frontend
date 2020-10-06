import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StixService } from '../stix.service';
import { Mitigation } from 'src/app/classes/stix/mitigation';

@Injectable({
  providedIn: 'root'
})
export class MitigationService extends StixService {

    private mitigations: Mitigation[] = [];

    constructor(private http: HttpClient) { 
        super();
    }

    public addMitigation(mitigation: {}): void {
        this.mitigations.push(new Mitigation(mitigation));
    }

    public get(stixID, refresh = false): Mitigation {
        return this.mitigations.filter((mitigation) => mitigation.stixID == stixID)[0];
    }

    public getAll(refresh = false): Mitigation[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let mitigations = data['objects'].filter((o) => o.type === 'course-of-action');
            for(let mitigation of mitigations) {
                let m = new Mitigation(mitigation);
                if(!this.mitigations.some(o => o.stixID === m.stixID) ) {
                    this.mitigations.push(m);
                }
            }
        });
        return this.mitigations;
    }
}
