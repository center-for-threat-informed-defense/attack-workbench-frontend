import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-resources-drawer',
    templateUrl: './resources-drawer.component.html',
    styleUrls: ['./resources-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResourcesDrawerComponent implements OnInit {
    @Output() drawerResize = new EventEmitter(); //emit events when the drawer is opened/closed
    public tabs = [
        {
            "name": "search",
            "label": "search",
            "icon": "search"
        },
        {
            "name": "citations",
            "label": "citation finder",
            "icon": "superscript"
        },
        {
            "name": "history",
            "label": "versions",
            "icon": "history"
        }
        // {
        //     "name": "saved",
        //     "label": "saved items",
        //     "icon": "bookmarks"
        // }
    ]
    public currentTab: string = "";

    public onTabClick(tab: any) {
        if (this.currentTab == tab.name) this.currentTab = "";
        else this.currentTab = tab.name;
        setTimeout(() => this.drawerResize.emit()); // emit after render loop
    }

    @Output() public onClose = new EventEmitter();
    public close() {
        this.onClose.emit();
    }


    constructor() { }

    ngOnInit() {
    }

}
