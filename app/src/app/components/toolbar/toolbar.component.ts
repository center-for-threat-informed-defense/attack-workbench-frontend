import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EditorService } from 'src/app/services/editor/editor.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {
    @Output() public onToggleTheme = new EventEmitter();
    @Output() public onToggleSidebar = new EventEmitter();
    @Output() public onScrollTop = new EventEmitter();
    
    @Input() public canScroll: boolean;

    public get editing(): boolean { return this.editorService.editing; }
    public get editable(): boolean { return this.editorService.editable; } 

    constructor(private sidebarService: SidebarService, private editorService: EditorService) {}

    ngOnInit() {}

    public startEditing() {
        this.editorService.startEditing();
    }

    public stopEditing() {
        this.editorService.stopEditing();
    }

    public saveEdits() {
        this.editorService.onSave.emit();
    }
    
    // emit a toggle theme event
    public emitToggleTheme() {
        this.onToggleTheme.emit();
    }
    //toggle sidebar
    public toggleSidebar() { 
        this.sidebarService.opened = !this.sidebarService.opened;
    }
    // emit scroll to top event
    public emitScrollTop() { 
        this.onScrollTop.emit();
    }
}