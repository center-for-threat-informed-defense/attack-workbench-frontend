import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Collection } from 'src/app/classes/stix/collection';
import { CollectionService } from 'src/app/services/stix/collection/collection.service';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss']
})
export class CollectionViewComponent implements OnInit {
    
    private collection: Collection;

    constructor(private route: ActivatedRoute, private collectionService: CollectionService) { }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get("id");
        console.log(id);
        this.collection = this.collectionService.get(id, true);
        console.log(this.collection);
    }

}
