import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
    selector: 'app-resources-drawer',
    templateUrl: './resources-drawer.component.html',
    styleUrls: ['./resources-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResourcesDrawerComponent implements OnInit {
    @Output() drawerResize = new EventEmitter(); //emit events when the drawer is opened/closed
    public get tabs() { return this.sidebarService.tabs; }
    public get currentTab(): string {return this.sidebarService.currentTab; }

    constructor(private sidebarService: SidebarService) { }

    public onTabClick(tab: any) {
        this.sidebarService.currentTab = tab.name;
        // if (this.currentTab == tab.name) this.currentTab = "";
        // else this.currentTab = tab.name;
        setTimeout(() => this.drawerResize.emit()); // emit after render loop
    }

    public close() {
        this.sidebarService.opened = false;
    }



    ngOnInit() {
    }

}
