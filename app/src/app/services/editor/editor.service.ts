import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

    public editable: boolean = false;
    public editing: boolean = false;
    public onSave = new EventEmitter();
    
    constructor(private router: Router, private route: ActivatedRoute) {
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
        if (this.editable)  this.router.navigate([], {queryParams: { editing: true }})
    }

    public stopEditing() {
        this.router.navigate([], {queryParams: {}})
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
