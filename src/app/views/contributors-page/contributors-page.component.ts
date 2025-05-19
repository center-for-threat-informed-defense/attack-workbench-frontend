import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StixObject } from 'src/app/classes/stix';
import { ContributorEditDialogComponent } from 'src/app/components/contributor-edit-dialog/contributor-edit-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
  selector: 'app-contributors-page',
  templateUrl: './contributors-page.component.html',
  styleUrls: ['./contributors-page.component.scss'],
  standalone: false,
})
export class ContributorsPageComponent implements OnInit, OnDestroy {
  private contributors: string[] = [];
  private numColumns = 3;
  private contributorMap: Map<string, StixObject[]>; // contributor -> list of STIX objects they contributed to
  private dialogSaveSubscription: Subscription;
  public loading = true;
  public columns: string[][];

  constructor(
    private restApiConnector: RestApiConnectorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if (this.dialogSaveSubscription) this.dialogSaveSubscription.unsubscribe();
  }

  /**
   * Load all objects and parse contributors
   */
  private load(): void {
    this.loading = true;
    this.contributorMap = new Map();
    const subscription = this.restApiConnector
      .getAllObjects({ revoked: true, deprecated: true, deserialize: true })
      .subscribe({
        next: results => {
          const contributors = new Set<string>();
          results.data.forEach(obj => {
            if (obj.contributors?.length) {
              obj.contributors.forEach(contributor => {
                contributors.add(contributor);
                if (this.contributorMap.has(contributor)) {
                  this.contributorMap.get(contributor).push(obj);
                } else {
                  this.contributorMap.set(contributor, [obj]);
                }
              });
            }
          });
          this.contributors = Array.from(contributors).sort(this.alphabetical);
          console.debug(`Retrieved ${this.contributors.length} contributors`);
          this.toColumns(this.numColumns);
        },
        complete: () => {
          this.loading = false;
          if (subscription) subscription.unsubscribe();
        },
      });
  }

  /**
   * Get the number of contributions made by the given contributor
   * @param contributor the contributor
   */
  public getNumContributions(contributor: string): number {
    const contributions = this.contributorMap.get(contributor);
    return contributions ? contributions.length : 0;
  }

  /**
   * Alphabetical sorting function
   */
  private alphabetical(a, b): number {
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
  }

  /**
   * Distribute contributors into the given number of columns
   * @param numColumns number of columns to display
   */
  public toColumns(numColumns: number) {
    this.columns = [];
    const chunk = Math.ceil(this.contributors.length / numColumns);
    for (let i = 0; i < numColumns; i++) {
      const start = i * chunk;
      this.columns.push(this.contributors.slice(start, start + chunk));
    }
  }

  /**
   * Open the contributor dialog to view their contributions
   * @param contributor the contributor
   */
  public openDialog(contributor: string): void {
    // open dialog
    const prompt = this.dialog.open(ContributorEditDialogComponent, {
      width: '50em',
      data: {
        contributor: contributor,
        objects: this.contributorMap.get(contributor),
      },
      autoFocus: false, // prevents auto focus on buttons
    });
    // subscribe to contributor changes
    this.dialogSaveSubscription = prompt.componentInstance.onSave.subscribe(
      newContributor => {
        const contributions = this.contributorMap.get(contributor);
        if (this.contributorMap.has(newContributor)) {
          this.contributorMap.get(newContributor).push(...contributions);
        } else {
          this.contributorMap.set(newContributor, contributions);
        }
        // update dialog data
        prompt.componentInstance.config = {
          contributor: newContributor,
          objects: this.contributorMap.get(newContributor),
        };
      }
    );
    // re-fetch values if an edit occurs
    const subscription = prompt.afterClosed().subscribe({
      next: _result => {
        if (prompt.componentInstance.dirty) {
          this.load();
        }
      },
      complete: () => subscription.unsubscribe(),
    });
  }
}
