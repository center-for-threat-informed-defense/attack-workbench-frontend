import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { DescriptivePropertyConfig } from '../descriptive-property.component';

@Component({
    selector: 'app-descriptive-view',
    templateUrl: './descriptive-view.component.html',
    styleUrls: ['./descriptive-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DescriptiveViewComponent implements OnInit {
    @Input() public config: DescriptivePropertyConfig;
    public preview: string;
    public loading: boolean = false;

    private reReference = /\(Citation: (.*?)\)/gmu;
    private reLinkById = /\(LinkById: (.*?)\)/gmu;
    private objectLookup = {};
    private sub: Subscription = new Subscription(); // prevent async issues

    constructor(private restApiConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        this.renderPreview();
    }

    private truncateToFirstParagraph(displayStr: string): string {
        return displayStr.split('\n')[0];
    }

    /**
     * remove references from descriptive property
     */
    private removeReferences(displayStr: string): string {
        return displayStr.replace(this.reReference, "");
    }

    /**
     * return list of references from descriptive property
     */
    private getReferencesFromDescription(displayStr: string): Array<string> {
        return displayStr.match(this.reReference);
    }

    /**
     * Replace reference citation to be rendered as HTML
     * @param sourceName source name of the reference
     * @param completeReference complete reference e.g., (Citation: Source Name)
     */
    private replaceCitationHTML(displayStr: string, sourceName: string, completeReference: string): string {
        let reference = this.config.referencesField.getReference(sourceName);
        let reference_number = this.config.referencesField.getIndexOfReference(sourceName);

        if (reference && reference_number) {
            let refHTML = ""
            if (reference.url) {
                refHTML = "<span><sup><a href=\"" + reference.url + "\" class=\"external-link\" target=\"_blank\">[" + reference_number + "]</a></sup></span>";
            }
            else {
                refHTML = "<span><sup>[" + reference_number + "]</sup></span>"
            }

            return displayStr.replace(completeReference, refHTML);
        }
        return displayStr;
    }

    /**
     * Replace references from descriptive property
     */
    private replaceReferences(displayStr: string): string {
        let referenceNames = this.getReferencesFromDescription(displayStr);

        let cleanReferenceNames = [];
        if (referenceNames) {
            for (let i = 0; i < referenceNames.length; i++) {
                cleanReferenceNames[i] = referenceNames[i].split("(Citation: ")[1].slice(0, -1);
                displayStr = this.replaceCitationHTML(displayStr, cleanReferenceNames[i], referenceNames[i]);
            }
        }

        return displayStr;
    }

    /**
     * return list of linked IDs from descriptive property
     */
    private getLinkedIds(displayStr: string): Array<string> {
        let matches = displayStr.match(this.reLinkById);
        if (!matches) return []; // no LinkByIds found
        return matches.map(link => link.split("(LinkById: ")[1].slice(0, -1));
    }

    /**
     * retrieve linked objects from REST API by ID
     * @param ids list of IDs to retrieve
     */
    private loadLinkedObjects(ids: string[]): Observable<any> {
        return this.restApiConnector.getAllObjects(ids, null, null, null, true, true, true).pipe(
            map((results: any) => {
                let data = results.data as StixObject[];
                // store retrieved objects in dictionary for quick lookup
                data.forEach(obj => this.objectLookup[obj.attackID] = obj);
                return results;
            })
        );
    }

    /**
     * replace LinkById tags with markdown formatted hyperlink
     */
    private replaceLinkByIds(displayStr: string, linkedIDs: string[]): string {
        for (let id of linkedIDs) {
            let obj = this.objectLookup[id];
            if (obj && obj.name) {
                let rep = `(LinkById: ${obj.attackID})`;
                let target = this.config.mode == 'edit' ? ` target="_blank"` : ``; // open linked object in new tab when editing
                let linkHTML = `<span><a href="${obj.attackType}/${obj.stixID}"${target}>${obj.name}</a></span>`;
                displayStr = displayStr.replace(rep, linkHTML);
            }
        }
        return displayStr;
    }

    /**
     * Render the descriptive view of the stix object
     */
    public renderPreview(): void {
        this.loading = true;
        this.preview = this.config.object[this.config.field];

        if (!this.preview) { // nothing to render
            this.loading = false;
            return;
        }

        if (this.config.firstParagraphOnly) {
            // Only show the first paragraph
            this.preview = this.truncateToFirstParagraph(this.preview);
        }

        if (this.config.referencesField) {
            // Replace references from references field
            this.preview = this.replaceReferences(this.preview);
        }
        else {
            // Remove references if not defined
            this.preview = this.removeReferences(this.preview);
        }

        let loaded = function(ids: string[], lookup: {}) {
            return ids.every(id => Object.keys(lookup).includes(id));
        }

        // Check for LinkById tags
        let linkedIDs = this.getLinkedIds(this.preview);
        if (!linkedIDs) {
            this.loading = false;
            return;
        }

        // Parse LinkById tags
        if (linkedIDs) {
            if (loaded(linkedIDs, this.objectLookup)) {
                this.preview = this.replaceLinkByIds(this.preview, linkedIDs);
                this.loading = false;
            } else {
                let missing = linkedIDs.filter(id => Object.keys(this.objectLookup).indexOf(id) < 0);
                this.sub = this.loadLinkedObjects(missing).subscribe({
                    next: (results: any) => {
                        this.preview = this.replaceLinkByIds(this.preview, linkedIDs);
                        this.loading = false;
                    },
                    complete: () => { this.sub.unsubscribe(); }
                })
            }
        }
    }
}
