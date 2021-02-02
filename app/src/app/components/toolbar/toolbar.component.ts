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

    public editing: boolean = false;
    public editable: boolean = false; //todo pull this from router config or something

    constructor(private router: Router, private route: ActivatedRoute, private sidebarService: SidebarService, private editorService: EditorService) {}

    //https://stackoverflow.com/questions/38644314/changing-the-page-title-using-the-angular-2-new-router/38652281#38652281
    private getEditableFromRoute(state, parent) { 
        let data = [];
        if (parent && parent.snapshot.data && parent.snapshot.data.editable) {
            data.push(parent.snapshot.data.editable);
        }
    
        if(state && parent) {
            data.push(... this.getEditableFromRoute(state, state.firstChild(parent)));
        }
        return data;
    }

    ngOnInit() {
        // console.log(this.route.snapshot.data)
        this.router.events.subscribe(event => { 
            if (event instanceof NavigationEnd) { 
                let editable = this.getEditableFromRoute(this.router.routerState, this.router.routerState.root);
                this.editable = editable.length > 0 && editable.every(x=>x);
            }
        })
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }

    public startEditing() {
        this.router.navigate([], {queryParams: { editing: true }})
    }

    public saveEdits() {
        this.editorService.onSave.emit();
        // this.router.navigate([], {queryParams: {}})
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