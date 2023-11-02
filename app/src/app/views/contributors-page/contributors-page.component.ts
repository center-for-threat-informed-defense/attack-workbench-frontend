import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StixObject } from 'src/app/classes/stix';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
	selector: 'app-contributors-page',
	templateUrl: './contributors-page.component.html',
	styleUrls: ['./contributors-page.component.scss']
})
export class ContributorsPageComponent implements OnInit {
    @ViewChild('contributorsDialog') public contributorsDialog: TemplateRef<any>;

    private contributors: string[] = [];
    private numColumns: number = 3;
    private contributorMap: Map<string, StixObject[]> = new Map(); // contributor -> list of STIX objects they contributed to
    public loading: boolean = true;
    public columns: string[][] = [];
    public dialogRef;

	constructor(private restApiConnector: RestApiConnectorService, public dialog: MatDialog) { }

	ngOnInit(): void {
        this.loading = true;
        let subscription = this.restApiConnector.getAllObjects(null, null, null, null, true, true, true).subscribe({
            next: (results) => {
                let contributors = new Set<string>();
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
            }
        })
    }

    /**
     * Get the number of contributions made by the given contributor
     * @param contributor the contributor
     */
    public getNumContributions(contributor: string): number {
        return this.contributorMap.get(contributor).length;
    }

    /**
     * Alphabetical sorting function
     */
    private alphabetical(a, b): number {
        return (a.toLowerCase() > b.toLowerCase()) ? 1 : -1;
    }

    /**
     * Distribute contributors into the given number of columns
     * @param numColumns number of columns to display
     */
    public toColumns(numColumns: number) {
        let chunk = Math.ceil(this.contributors.length / numColumns);
        for (let i = 0; i < numColumns; i++) {
            let start = i * chunk;
            this.columns.push(this.contributors.slice(start, start + chunk));
        }
    }

    /**
     * Open the contributor dialog to view their contributions
     * @param contributor the contributor
     */
    public openDialog(contributor: string): void {
        this.dialogRef = this.dialog.open(this.contributorsDialog, {
            width: '50em',
            data: {
                contributor: contributor,
                objects: this.contributorMap.get(contributor)
            }
        });
    }
}
