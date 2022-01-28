import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
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

    constructor(private restApiConnector: RestApiConnectorService) { }

    private reReference = /\(Citation: (.*?)\)/gmu;
    private reLinkById = /\(LinkById: (.*?)\)/gmu;
    private attackObjects: any[] = [];
    private get hasLinkByIds(): boolean {
        let links = this.getLinkByIds(this.config.object[this.config.field]);
        return links && links.length > 0;
    }

    ngOnInit(): void {
        if (this.hasLinkByIds) { // retrieve all named objects if field has a LinkById tag
            const objectSubscription = this.restApiConnector.getAllObjects(null, null, null, null, true, true, true).subscribe({
                next: (results) => {
                    this.attackObjects = results.data.filter(obj => obj.hasOwnProperty("name"));
                },
                complete: () => { objectSubscription.unsubscribe(); }
            })
        }
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
     * return list of link by IDs from descriptive property
     */
    private getLinkByIds(displayStr: string): Array<string> {
        return displayStr.match(this.reLinkById);
    }

    /**
     * replaces LinkById tags with a markdown hyperlink to their
     * related object
     */
    private replaceLinkByIds(displayStr: string): string {
        let linkByIdRefs = this.getLinkByIds(displayStr);

        // parse LinkByIds
        if (linkByIdRefs) {
            let linkHTML: string;
            for (let linkById of linkByIdRefs) {
                let id = linkById.split("(LinkById: ")[1].slice(0, -1);
                let linkedObj = this.attackObjects.find(obj => obj.attackID == id);
                if (linkedObj && linkedObj.name) {
                    linkHTML = `<span><a href="${linkedObj.attackType}/${linkedObj.stixID}">${linkedObj.name}</a></span>`;
                    displayStr = displayStr.replace(linkById, linkHTML);
                }
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

        displayStr = this.replaceLinkByIds(displayStr);

        return displayStr;
    }
}
