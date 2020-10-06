import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-resources-drawer',
    templateUrl: './resources-drawer.component.html',
    styleUrls: ['./resources-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResourcesDrawerComponent implements OnInit {
    @Output() drawerResize = new EventEmitter(); //emit events when the drawer is opened/closed
    private tabs = [
        {
            "name": "search",
            "label": "search",
            "icon": "search"
        },
        {
            "name": "tram",
            "label": "threat reports",
            "icon": "tram" //alternate icon: assignments
        },
        {
            "name": "saved",
            "label": "saved items",
            "icon": "bookmarks"
        }
    ]
    private currentTab: string = "";

    private onTabClick(tab: any) {
        if (this.currentTab == tab.name) this.currentTab = "";
        else this.currentTab = tab.name;
        setTimeout(() => this.drawerResize.emit()); // emit after render loop
    }

    constructor() { }

    ngOnInit() {
    }

}
