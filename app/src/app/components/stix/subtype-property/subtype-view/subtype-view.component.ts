import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SubtypePropertyConfig } from '../subtype-property.component';

@Component({
	selector: 'app-subtype-view',
	templateUrl: './subtype-view.component.html',
	styleUrls: ['./subtype-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SubtypeViewComponent implements OnInit {
	@Input() public config: SubtypePropertyConfig;

    private citationRegex = /\(Citation: (.*?)\)/gmu;
    public showMore: boolean = false;
	public detailTable: any[] = [];

	public get subtypeFields() { return this.config.subtypeFields; }
	public get fieldLabels(): string[] { return this.config.subtypeFields.map(f => f.label ? f.label : f.name); }

    public get valueCopy() {
        return JSON.parse(JSON.stringify(this.config.object[this.config.field])); //deep copy
    }

	ngOnInit(): void {
		this.detailTable = this.valueCopy;
		this.buildTable();
	}

    /**
     * Get list of references in string
     * @param value string that may contains references
     */
    private getReferences(value: string): Array<string> {
        return value.match(this.citationRegex);
    }

    /**
     * Get HTML string for reference
     * @param sourceName source name of the reference
     */
    private referenceToHTML(sourceName: string): string {
        let reference = this.config.object[this.config.referencesField].getReference(sourceName);
        let referenceNumber = this.config.object[this.config.referencesField].getIndexOfReference(sourceName);

        if (reference && referenceNumber) {
            if (reference.url) {
                return "<span><sup><a href=\"" + reference.url + "\" class=\"external-link\" target=\"_blank\">[" + referenceNumber + "]</a></sup></span>";
            }
            return "<span><sup>[" + referenceNumber + "]</sup></span>"
        }
        return "";
    }

    // Build table of values including any inline citations
    public buildTable(): void {
		// get subtype field that supports references
		let referenceField = this.config.subtypeFields.find(f => f.supportsReferences);
		if (!referenceField || !this.config.referencesField) return;
		for (let row of this.detailTable) {
			if (referenceField.name in row) {
				// field supporting references found in row, parse citations
				let references = this.getReferences(row[referenceField.name]);
				if (references) {
					for (let reference of references) {
						let sourceName = reference.split("(Citation: ")[1].slice(0, -1);
						let referenceHTML = this.referenceToHTML(sourceName);
						row[referenceField.name] = row[referenceField.name].replace(reference, referenceHTML);
					}
				}
			}
		}
    }

    /** Format table column */
    public format(value): string {
        if (Array.isArray(value)) return value.join("; ");
        return value;
    }
}
