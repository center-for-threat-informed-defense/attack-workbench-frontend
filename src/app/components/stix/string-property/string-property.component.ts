import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-string-property',
  templateUrl: './string-property.component.html',
  styleUrls: ['./string-property.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class StringPropertyComponent implements OnInit {
  @Input() public config: StringPropertyConfig;

  public selectControl: FormControl;
  public loading = false;
  public options: Set<string>;

  // prevent async issues
  private subscription: Subscription = new Subscription();

  public get current() {
    return this.config.object[0]?.[this.config.field] || '';
  }
  public get previous() {
    return this.config.object[1]?.[this.config.field] || '';
  }

  constructor(private apiService: RestApiConnectorService) {}

  ngOnInit(): void {
    if (this.config.editType === 'select') {
      this.selectControl = new FormControl({
        value: this.config.object[this.config.field],
      });

      if (this.config.field == 'platform') {
        this.loading = true;
        const data$ = this.apiService.getAllAllowedValues();
        this.subscription = data$.subscribe({
          next: data => {
            const stixObject = this.config.object as StixObject;
            this.options =
              data.find(obj => {
                return obj.objectType == stixObject.attackType;
              }) ?? [];
            this.loading = false;
          },
          complete: () => this.subscription.unsubscribe(),
        });
      }
    }
  }
}

export interface StringPropertyConfig {
  /* What is the current mode? Default: 'view
   *    view: viewing the property
   *    edit: editing the property
   *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
   */
  mode?: 'view' | 'edit' | 'diff';
  /* The object to show the field of
   * Note: if mode is diff, pass an array of two objects to diff
   */
  object: StixObject | [StixObject, StixObject];
  /* the field of the object(s) */
  field: string;
  /* if specified, label with this string instead of field */
  label?: string;
  /* If true, the field will be required. Default false if omitted. */
  required?: boolean;
  /* Edit type. Default: 'any' */
  editType?: 'select' | 'any';
}
