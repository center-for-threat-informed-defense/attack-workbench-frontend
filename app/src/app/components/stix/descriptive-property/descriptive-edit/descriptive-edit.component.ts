import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DescriptivePropertyConfig } from '../descriptive-property.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-descriptive-edit',
  templateUrl: './descriptive-edit.component.html',
  styleUrls: ['./descriptive-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DescriptiveEditComponent implements OnInit {
    @Input() public config: DescriptivePropertyConfig;
    public parsingCitations: boolean = false;
    constructor(public restApiConnector: RestApiConnectorService) { }

    ngOnInit(): void {
    }

    parseCitations() {
        this.parsingCitations = true;
        let subscription = this.config.object['external_references'].parseCitations(this.config.object[this.config.field], this.restApiConnector).subscribe({
            next: (result) => {
                console.log("result returned", result);
                this.parsingCitations = false;
                // subscription.unsubscribe(); 
            },
            // complete: () => { subscription.unsubscribe();  } //TODO why doesn't this work in this case?
        })
    }
}
