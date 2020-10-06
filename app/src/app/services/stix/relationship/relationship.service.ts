import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StixService } from '../stix.service';
import { Relationship } from 'src/app/classes/stix/relationship';

@Injectable({
  providedIn: 'root'
})
export class RelationshipService extends StixService {

    private relationships: Relationship[] = [];

    constructor(private http: HttpClient) {
        super();
    }

    public get(stix_id: string, refresh = false): Relationship {
        return null;
    }
    
    public getAll(refresh = false): Relationship[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let relationships = data['objects'].filter((o) => o.type === 'relationship');
            for(let relationship of relationships) {
                let r = new Relationship(relationship);
                if(!this.relationships.some(o => o.stixID === r.stixID) ) {
                    this.relationships.push(r);
                }
            }
        });
        return this.relationships;
    }
}
