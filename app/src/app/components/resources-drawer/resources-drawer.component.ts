import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
    selector: 'app-resources-drawer',
    templateUrl: './resources-drawer.component.html',
    styleUrls: ['./resources-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResourcesDrawerComponent implements OnInit {
    @Output() onClose = new EventEmitter(); 
    @Input() useService: boolean = true; //if true, control of this drawer is performed through the sidebar service. Otherwise, events and internal state are used.
    @Input() showCloseButton: boolean = true;
    @Input() currentTabOverride: string = "history";
    
    public get tabs() { return this.sidebarService.tabs; }
    public get currentTab(): string {
        if (this.useService) return this.sidebarService.currentTab;
        else return this.currentTabOverride;
    }
    public get isLoggedIn(): boolean { return this.authenticationService.isLoggedIn; }

    constructor(public sidebarService: SidebarService, public authenticationService: AuthenticationService) { }

    public onTabClick(tab: any) {
        if (this.useService) this.sidebarService.currentTab = tab.name;
        else this.currentTabOverride = tab.name;
    }

    public close() {
        if (this.useService) this.sidebarService.opened = false;
        else this.onClose.emit();
    }

    ngOnInit() {
        // intentionally left blank
    }
}
