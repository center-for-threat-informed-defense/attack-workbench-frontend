import { Component, Input, ViewEncapsulation } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { DescriptivePropertyConfig } from '../descriptive-property.component';

@Component({
    selector: 'app-descriptive-view',
    templateUrl: './descriptive-view.component.html',
    styleUrls: ['./descriptive-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DescriptiveViewComponent {
    @Input() public config: DescriptivePropertyConfig;

    private reReference = /\(Citation: (.*?)\)/gmu;
    private reLinkById = /\(LinkById: (.*?)\)/gmu;
    private objectLookup = {};

    // prevent async issues
    private sub: Subscription = new Subscription();

    constructor(private restApiConnector: RestApiConnectorService) { }

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
        let api_map = {};
        for (let id of ids) {
            api_map[id] = this.restApiConnector.getAllObjects(id, null, null, null, true, true, true)
        }

        return forkJoin(api_map).pipe(
            map((results: any) => {
                // store retrieved objects in dictionary for quick lookup
                Object.keys(results).forEach(id => this.objectLookup[id] = results[id].data[0]);
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
     * get the descriptive view of of the stix object
     */
    public get display(): string {
        let displayStr: string = this.config.object[this.config.field];

        if (!displayStr) {
            return displayStr
        }

        // Check if it is only the first paragraph
        if (this.config.firstParagraphOnly) {
            displayStr = this.truncateToFirstParagraph(displayStr);
        }

        if (this.config.referencesField) {
            // Replace references from references field
            displayStr = this.replaceReferences(displayStr);
        }
        else {
            // Remove references if not defined
            displayStr = this.removeReferences(displayStr);
        }

        let loaded = function(ids: string[], lookup: {}) {
            return ids.every(id => Object.keys(lookup).includes(id));
        }

        let linkedIDs = this.getLinkedIds(displayStr);
        if (linkedIDs) {
            if (loaded(linkedIDs, this.objectLookup)) {
                displayStr = this.replaceLinkByIds(displayStr, linkedIDs);
            } else {
                let missing = linkedIDs.filter(id => Object.keys(this.objectLookup).indexOf(id) < 0);
                this.sub = this.loadLinkedObjects(missing).subscribe({
                    next: (results: any) => {
                        displayStr = this.replaceLinkByIds(displayStr, linkedIDs);
                    },
                    complete: () => { this.sub.unsubscribe(); }
                })
            }
        }

        return displayStr;
    }
}
