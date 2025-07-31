import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
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
export class StringPropertyComponent implements OnInit, OnChanges {
  @Input() public config: StringPropertyConfig;

  public selectControl: FormControl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public allowedValues: any;
  public channels: Set<string>;
  public loading = false;

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
        disabled: this.config.disabled ?? false,
      });

      if (this.config.field === 'platform') {
        this.loading = true;
        const data$ = this.apiService.getAllAllowedValues();
        this.subscription = data$.subscribe({
          next: data => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = this.config.object as any;
            this.allowedValues =
              data.find(v => {
                return v.objectType == obj.attackType;
              }) ?? [];
            this.loading = false;
          },
          complete: () => this.subscription.unsubscribe(),
        });
      } else if (
        this.config.field === 'logSourceChannel' &&
        this.config.relatedStixId
      ) {
        this.loadLogSourceChannels(this.config.relatedStixId);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      // react to changes in 'disabled' property
      if (this.selectControl) {
        const isDisabled = this.config.disabled ?? false;
        if (isDisabled) this.selectControl.disable();
        else this.selectControl.enable();
      }

      // react to changes in 'relatedStixId' property for logSourceChannel field
      if (
        this.config.field === 'logSourceChannel' &&
        this.config.relatedStixId
      ) {
        this.loadLogSourceChannels(this.config.relatedStixId);
      }
    }
  }

  public getOptions(): Set<string> {
    let options = new Set<string>();
    if (this.loading) return options;
    if (this.config.field === 'platform') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj = this.config.object as any;
      const properties = this.allowedValues.properties.find(p => {
        return p.propertyName == 'x_mitre_platforms';
      });
      properties?.domains?.forEach(d => {
        if (obj?.domains?.includes(d.domainName)) {
          d.allowedValues.forEach(options.add, options);
        }
      });
    } else if (this.config.field === 'logSourceChannel') {
      options = this.channels;
    }
    return options;
  }

  public change(event: MatOptionSelectionChange): void {
    if (event.isUserInput && event.source.selected) {
      this.config.object[this.config.field] = event.source.value;
    }
  }

  private loadLogSourceChannels(relatedStixId: string): void {
    this.loading = true;
    const data$ = this.apiService.getLogSourceChannels(relatedStixId);
    this.subscription = data$.subscribe({
      next: data => {
        this.channels = new Set(data);
        this.loading = false;
      },
      complete: () => this.subscription.unsubscribe(),
    });
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
  /* If true, the field will be disabled. Default false if omitted. */
  disabled?: boolean;
  /* Edit type. Default: 'any' */
  editType?: 'select' | 'any';
  /* The stixId of an object related to the string selection; used to load
  the list of selection options. */
  relatedStixId?: string;
}
