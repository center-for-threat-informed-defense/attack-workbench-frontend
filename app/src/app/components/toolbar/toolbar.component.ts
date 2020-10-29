import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';

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

    constructor() {}

    ngOnInit() {
    }
    
    // emit a toggle theme event
    public emitToggleTheme() {
        this.onToggleTheme.emit();
    }
    // emit toggle sidebar event
    public emitToggleSidebar() { 
        this.onToggleSidebar.emit();
    }
    // emit scroll to top event
    public emitScrollTop() { 
        this.onScrollTop.emit();
    }
}