import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { StixViewConfig } from 'src/app/views/stix/stix-view-page';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
  selector: 'app-subheading',
  templateUrl: './subheading.component.html',
  styleUrls: ['./subheading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubheadingComponent implements OnInit {
    @Input() public config: StixViewConfig;
    @Output() public onOpenHistory = new EventEmitter();
    @Output() public onOpenNotes = new EventEmitter();

    public get editing(): boolean { return this.editorService.editing; }

    public openHistory() {
        if (this.config.sidebarControl == "service" || !this.config.hasOwnProperty("sidebarControl")) {
            this.sidebarService.opened = true; 
            this.sidebarService.currentTab = "history"
        } else if (this.config.sidebarControl == "events") {
            this.onOpenHistory.emit()
        }
    }
    public openNotes() {
        if (this.config.sidebarControl == "service" || !this.config.hasOwnProperty("sidebarControl")) {
            this.sidebarService.opened = true;
            this.sidebarService.currentTab = "notes";
        } else if (this.config.sidebarControl == "events") {
            this.onOpenNotes.emit()
        }
    }

    constructor(private sidebarService: SidebarService, private editorService: EditorService) { }

    ngOnInit(): void {
        // intentionally left blank
    }
}
