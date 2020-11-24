import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-subheading',
  templateUrl: './subheading.component.html',
  styleUrls: ['./subheading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubheadingComponent implements OnInit {
    @Input() public config: SubheadingConfig

    public openHistory() {
        this.sidebarService.opened = true; 
        this.sidebarService.currentTab = "history"
    }
    public openNotes() {
        this.sidebarService.opened = true;
        this.sidebarService.currentTab = "notes";
    }

    constructor(private sidebarService: SidebarService) { }

    ngOnInit(): void {
    }

}
export interface SubheadingConfig {
    // the object to display a subheading for
    object: StixObject
}
