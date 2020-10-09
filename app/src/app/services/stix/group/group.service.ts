import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { StixService } from '../stix.service';
import { Group } from 'src/app/classes/stix/group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends StixService {

    private groups: Group[] = [];
    
    constructor(private http: HttpClient) {
        super();
    }

    public get(stixID: string, refresh = false): Group {
        return this.groups.filter((group: Group) => group.stixID == stixID)[0];
    }

    public getAll(refresh = false): Group[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let groups = data['objects'].filter((o) => o.type === 'intrusion-set');
            for(let group of groups) {
                let g = new Group(group);
                if(!this.groups.some(o => o.stixID === g.stixID) ) {
                    this.groups.push(g);
                }
            }
            console.log("loaded groups", this.groups)
        });
        return this.groups;
    }
}
