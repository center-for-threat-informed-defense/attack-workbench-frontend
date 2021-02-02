import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveDialogComponent } from 'src/app/components/save-dialog/save-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
    constructor(private dialog: MatDialog) { }
    public onSave = new EventEmitter();
    
    // public save() {
    //     let prompt = this.dialog.open(SaveDialogComponent, {
    //         maxWidth: "35em"
    //     });
    //     let subscription = prompt.afterClosed().subscribe({
    //         next: (result) => {
    //             console.log(result);
    //         },
    //         complete: () => { subscription.unsubscribe(); } //prevent memory leaks
    //     })
    // }
}
