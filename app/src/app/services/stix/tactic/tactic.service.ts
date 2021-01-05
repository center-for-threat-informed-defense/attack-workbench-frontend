import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StixService } from '../stix.service';
import { Tactic } from 'src/app/classes/stix/tactic';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';

@Injectable({
  providedIn: 'root'
})
export class TacticService extends StixService {

    private tactics: Tactic[] = [];

    constructor(private http: HttpClient) {
        super();
    }

    public addTactic(tactic: {}): void {
        this.tactics.push(new Tactic(tactic));
    }

    public get(stixID: string, refresh = false): Tactic {
        return this.tactics.filter((tactic) => tactic.stixID == stixID)[0];
    }

    public getAll(refresh = false): Tactic[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let tactics = data['objects'].filter((o) => o.type === 'x-mitre-tactic');
            for(let tactic of tactics) {
                let t = new Tactic({"stix": tactic, "workspace": {"domains":[]}});
                if(!this.tactics.some(o => o.stixID === t.stixID) ) {
                    this.tactics.push(t);
                }
            }
        });
        return this.tactics;
    }
}
