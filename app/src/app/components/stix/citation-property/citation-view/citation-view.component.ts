import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { CitationPropertyConfig } from '../citation-property.component';

@Component({
    selector: 'app-citation-view',
    templateUrl: './citation-view.component.html',
    styleUrls: ['./citation-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CitationViewComponent implements OnInit {
    @Input() public config: CitationPropertyConfig;
    public loading: boolean = false;
    public display: string;

    private reReference = /\(Citation: (.*?)\)/gmu;

    constructor(private restApiService: RestApiConnectorService) {
        // intentionally left blank
    }

    ngOnInit(): void {
        this.renderCitation();
    }

    /**
     * Render the citation view for the field
     */
    public renderCitation(): void {
        this.loading = true;
        this.display = this.config.object[this.config.field];
    
        if (!this.display) { // nothing to render
            this.loading = false;
            return;
        }

        // parse references and replace from references field
        if (this.config.referencesField) this.parseReferences();
        // remove references if not defined
        else this.display.replace(this.reReference, "");

        this.loading = false;
    }

    /**
     * Parse and replace references from citation property
     */
    private parseReferences(): void {
        let references = this.display.match(this.reReference);
        let sourceNames = [];
        if (references) {
            for (let i = 0; i < references.length; i++) {
                sourceNames[i] = references[i].split("(Citation: ")[1].slice(0, -1);
                this.citationToHTML(sourceNames[i], references[i]);
            }
        }
    }

    /**
     * Replace the reference citation to render in HTML
     * @param {string} sourceName source name of the reference
     * @param {string} citation complete citation string, e.g. (Citation: sourceName)
     */
    private citationToHTML(sourceName: string, citation: string): void {
        let reference = this.config.referencesField.getReference(sourceName);
        let referenceNum = this.config.referencesField.getIndexOfReference(sourceName);
        if (reference && referenceNum) {
            let html = "";
            if (reference.url) {
                html = "<span><sup><a href=\"" + reference.url + "\" class=\"external-link\" target=\"_blank\">[" + referenceNum + "]</a></sup></span>";
            } else html = "<span><sup>[" + referenceNum + "]</sup></span>";
            this.display.replace(citation, html);
        }
    }
}
