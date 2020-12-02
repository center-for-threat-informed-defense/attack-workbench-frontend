import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
    // sidebar tab settings
    private _currentTab: tabOption = "search"
    public onTabChange = new EventEmitter();
    public get currentTab(): tabOption { return this._currentTab; }
    public set currentTab(tab: tabOption) {
        this._currentTab = tab;
        setTimeout(() => this.onTabChange.emit()); //emit after render loop
    }
    public readonly tabs: tabDefinition[] = [
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
        },
        {
            "name": "notes",
            "label": "notes",
            "icon": "sticky_note_2_outlined"
        }
    ]
    //is the sidebar currently opened?
    private _opened: boolean = false;
    public onOpened = new EventEmitter();
    public get opened(): boolean { return this._opened; }
    public set opened(value: boolean) { 
        this._opened = value;
        this.onOpened.emit();
    } 
    public toggleOpened() { 
        this._opened = !this._opened;
        setTimeout(() => this.onOpened.emit()); //emit after render loop
    }
    
    

    constructor() { }
}
export type tabOption = "search" | "citations" | "history" | "notes";

interface tabDefinition {
    name: tabOption, // the tab name
    label: string, //ui for tab in tooltip, etc
    icon: string //material icon to use for tab
}