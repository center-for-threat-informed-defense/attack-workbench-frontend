import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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

    public editing: boolean = false;
    public editable: boolean = false; //todo pull this from router config or something

    constructor(private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }

    public startEditing() {
        this.router.navigate([], {queryParams: { editing: true }})
    }

    public saveEdits() {
        this.router.navigate([], {queryParams: {}})
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