import { Component, OnInit } from '@angular/core';
import { Collection } from 'src/app/classes/stix/collection';
import { ActivatedRoute } from '@angular/router';
import { CollectionService } from 'src/app/services/stix/collection/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { versionNumberIncrementValidator, versionNumberFormatValidator } from 'src/app/classes/version-number';
import { GroupService } from 'src/app/services/stix/group/group.service';
import { MatrixService } from 'src/app/services/stix/matrix/matrix.service';
import { MitigationService } from 'src/app/services/stix/mitigation/mitigation.service';
import { SoftwareService } from 'src/app/services/stix/software/software.service';
import { TacticService } from 'src/app/services/stix/tactic/tactic.service';
import { TechniqueService } from 'src/app/services/stix/technique/technique.service';
import { Group } from 'src/app/classes/stix/group';
import { Software } from 'src/app/classes/stix/software';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
  selector: 'app-collection-export',
  templateUrl: './collection-export.component.html',
  styleUrls: ['./collection-export.component.scss']
})
export class CollectionExportComponent implements OnInit {

    private collection: Collection;

    private collectionInformation: FormGroup;

    // this won't actually be here, it's just for the mockups
    private contents: StixObject[] = [];

    constructor(private route: ActivatedRoute, 
                private collectionService: CollectionService, 
                private formBuilder: FormBuilder,
                
                private groupService: GroupService,
                private matrixService: MatrixService,
                private mitigationService: MitigationService,
                private softwareService: SoftwareService,
                private tacticService: TacticService,
                private techniqueService: TechniqueService) { }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get("id");
        if (id) this.collection = this.collectionService.get(id, true);
        else this.collection = new Collection();
        
        let versionValidators = id ? [ //if existing collection, require increment
            Validators.required, //field is required
            versionNumberFormatValidator(), //must be formatted correctly
            versionNumberIncrementValidator(this.collection.version) //must be incremented compared to previous collection version
        ] : [ //if new collection, do not require increment
            Validators.required, //field is required
            versionNumberFormatValidator(), //must be formatted correctly
        ]

        this.collectionInformation = this.formBuilder.group({
            name: [this.collection.name, Validators.required],
            description: [this.collection.description],
            version: [this.collection.version.toString(), versionValidators],
        })
        this.collectionInformation.markAllAsTouched(); // force field validation on page load
        for (let service of [this.groupService,
                             this.matrixService,
                             this.mitigationService,
                             this.softwareService,
                             this.tacticService,
                             this.techniqueService]) {
                this.contents = this.contents.concat(service.getAll());
        }
    }

    

}
