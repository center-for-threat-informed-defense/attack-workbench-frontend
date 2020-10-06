import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Collection } from 'src/app/classes/stix/collection';
import { StixService } from '../stix.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService extends StixService {

    private collections: Collection[] = [];

    constructor(private http: HttpClient) {
        super();
    }

    public addCollection(collection: {}): void {
        this.collections.push(new Collection(collection));
    }

    public get(stixID: string, refresh = false): Collection {
        return this.collections.filter((collection: Collection) => collection.stixID == stixID)[0];
    }
    
    public getAll(refresh = false): Collection[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let collections = data['objects'].filter((o) => o.type === 'x-mitre-collection');
            for(let collection of collections) {
                let c = new Collection(collection);
                if(!this.collections.some(o => o.stixID === c.stixID) ) {
                    this.collections.push(c);
                }
            }
        });
        return this.collections;
    }
}