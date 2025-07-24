import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ObjectRefPropertyConfig } from '../object-ref-property.component';
import { StixObject } from 'src/app/classes/stix';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-object-ref-view',
  templateUrl: './object-ref-view.component.html',
  styleUrl: './object-ref-view.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ObjectRefViewComponent implements OnInit, OnDestroy {
  @Input() public config: ObjectRefPropertyConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public refTable: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public fields: any[];
  public attackObjects: StixObject[];
  private subscription: Subscription;

  public get fieldDefs(): string[] {
    return this.fields.map(f => f.field);
  }

  constructor(private apiService: RestApiConnectorService) {}

  ngOnInit(): void {
    this.loadAttackObjects();
    this.refTable = JSON.parse(
      JSON.stringify(this.config.object[this.config.field])
    );
    const refField = {
      ...this.config.objectRefField,
      isRefField: true,
    };
    this.fields = [refField, ...this.config.relatedFields];
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public loadAttackObjects() {
    if (this.config.attackType == 'log-source') {
      this.subscription = this.apiService.getAllLogSources().subscribe({
        next: results => {
          this.attackObjects = results.data;
        },
      });
    }
  }

  /** Format table columns */
  public format(value): string {
    if (Array.isArray(value)) return value.join('; ');
    return value;
  }

  /**
   * retrieve the internal link to the object
   * @param {string} stixID obj stix ID
   */
  public internalLink(stixID: string): string {
    return `/${this.config.attackType}/${stixID}`;
  }

  /**
   * Get the ATT&CK ID for the given object
   * @param {string} stixID obj stix ID
   */
  public getAttackId(stixID: string): string {
    return this.attackObjects?.find(o => o.stixID === stixID)?.attackID;
  }
}
