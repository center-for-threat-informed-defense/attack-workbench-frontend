import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidebarService } from '../sidebar/sidebar.service';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

    public editable: boolean = false;
    public editing: boolean = false;
    public onSave = new EventEmitter();
    
    constructor(private router: Router, private route: ActivatedRoute, private sidebarService: SidebarService, private dialog: MatDialog) {
        this.router.events.subscribe(event => { 
            if (event instanceof NavigationEnd) { 
                let editable = this.getEditableFromRoute(this.router.routerState, this.router.routerState.root);
                this.editable = editable.length > 0 && editable.every(x=>x);
                this.sidebarService.setEnabled("history", this.editable);
            }
        })
        this.route.queryParams.subscribe(params => {
            this.editing = params["editing"];
        });
    }

    public startEditing() {
        if (this.editable)  this.router.navigate([], {queryParams: { editing: true }})
    }

    public stopEditing() {
        let prompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "35em",
            data: { 
                message: '# Are you sure you want to discard changes?',
            }
        });
  
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    if (!(this.router.url.includes("/new"))) this.router.navigate([], {queryParams: {}})
                    else this.router.navigate([".."], {queryParams: {}})
                }
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        });
    }

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
}
