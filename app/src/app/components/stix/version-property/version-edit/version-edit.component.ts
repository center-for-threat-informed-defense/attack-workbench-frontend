import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VersionPropertyConfig } from '../version-property.component';

@Component({
    selector: 'app-version-edit',
    templateUrl: './version-edit.component.html',
    styleUrls: ['./version-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VersionEditComponent implements OnInit {
    @Input() public config: VersionPropertyConfig;

    public get field(): string { return this.config.field ? this.config.field : 'version'; }
    public get version(): number { return this.config.object[this.field].version as number; }

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        // intentionally left blank
    }

    public setVersion(event: any): void {
        let newVersion = '';
        if (event.target.valueAsNumber) newVersion = event.target.valueAsNumber.toFixed(1);
        this.config.object[this.field].version = newVersion;
    }
}
