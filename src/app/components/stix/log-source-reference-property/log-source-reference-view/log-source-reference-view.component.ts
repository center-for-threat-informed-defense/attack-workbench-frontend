import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LogSourceReferencePropertyConfig } from '../log-source-reference-property.component';
import { DataComponent } from 'src/app/classes/stix';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { LogSourceReference } from 'src/app/classes/stix/analytic';

@Component({
  selector: 'app-log-source-reference-view',
  templateUrl: './log-source-reference-view.component.html',
  styleUrl: './log-source-reference-view.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class LogSourceReferenceViewComponent implements OnInit, OnDestroy {
  @Input() public config: LogSourceReferencePropertyConfig;

  public fields = ['dataComponentRef', 'name', 'channel'];
  public dataComponents: DataComponent[];
  private subscription: Subscription;

  public get logSourceReferences(): LogSourceReference[] {
    return this.config.object['logSourceReferences'];
  }

  constructor(private apiService: RestApiConnectorService) {}

  ngOnInit(): void {
    this.subscription = this.apiService.getAllDataComponents().subscribe({
      next: results => {
        this.dataComponents = results.data as DataComponent[];
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  /**
   * Retrieve the internal link to the object
   * @param {string} stixID data component stix ID
   */
  public internalLink(stixID: string): string {
    return `/data-component/${stixID}`;
  }

  /**
   * Get the name for the given STIX ID
   * @param {string} stixID data component STIX ID
   */
  public getName(stixID: string): string {
    return this.dataComponents?.find(dc => dc.stixID === stixID)?.name;
  }

  /**
   * Get the ATT&CK ID for the given STIX ID
   * @param {string} stixID data component STIX ID
   */
  public getAttackId(stixID: string): string {
    return this.dataComponents?.find(dc => dc.stixID === stixID)?.attackID;
  }
}
