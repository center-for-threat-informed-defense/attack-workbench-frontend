import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StixService } from '../stix.service';
import { Technique } from 'src/app/classes/stix/technique';

@Injectable({
  providedIn: 'root'
})
export class TechniqueService extends StixService {

    private techniques: Technique[] = [];

    constructor(private http: HttpClient) { 
        super();
    }

    public get(stixID, refresh = false): Technique {
        return this.techniques.filter((technique) => technique.stixID == stixID)[0];
    }

    public getAll(refresh = false): Technique[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let techniques = data['objects'].filter((o) => o.type === 'attack-pattern');
            for(let technique of techniques) {
                let t = new Technique({"stix": technique, "workspace": {"domains":[]}});
                if(!this.techniques.some(o => o.stixID === t.stixID) ) {
                    this.techniques.push(t);
                }
            }
        });
        return this.techniques;
    }
}
