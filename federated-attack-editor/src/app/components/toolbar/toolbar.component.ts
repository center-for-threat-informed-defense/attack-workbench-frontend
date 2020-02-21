import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {
    @Output() onToggleTheme = new EventEmitter();
    
    constructor() {}

    ngOnInit() {
    }
    
    //emit a toggle theme event
    private emitToggleTheme() {
        this.onToggleTheme.emit();
    }
}