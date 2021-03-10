import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Note } from 'src/app/classes/stix/note';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-notes-editor',
    templateUrl: './notes-editor.component.html',
    styleUrls: ['./notes-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotesEditorComponent implements OnInit {
    @Output() public drawerResize = new EventEmitter();
    
    public loading: boolean = false;
    public editing: boolean = false;
    public notes: Note[];

    constructor(private router: Router, private restAPIConnectorService: RestApiConnectorService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.loading = true;
        let objects$ = this.restAPIConnectorService.getAllNotes();
        let subscription = objects$.subscribe({
            next: (result) => {
                this.parseNotes(result.data as Note[]);
                this.loading = false;
                this.resizeDrawers();
            },
            complete: () => { subscription.unsubscribe() }
        });
    }

    private parseNotes(notes: Note[]): void {
        let objectStixID = this.router.url.split("/")[2].split("?")[0];
        this.notes = notes.filter(note => note.object_refs.includes(objectStixID));
        this.notes = [
            new Note({
                "stix": {
                    "content": "Lorem ipsum dolor sit amet, **consectetur** adipiscing elit. Praesent sapien ligula, tincidunt commodo leo quis, aliquam molestie nisl. Vestibulum iaculis purus fringilla, interdum ipsum a.",
                }
            }),
            new Note({
                "stix": {
                    "abstract": "Aenean efficitur dictum.",
                    "content": "Praesent in nisi viverra, efficitur nibh quis, euismod sapien. Quisque consequat sapien ut arcu fringilla cursus. Curabitur tincidunt ut lorem non pretium. Quisque sollicitudin vestibulum fermentum. Aenean interdum mauris iaculis, porttitor nibh id, elementum nibh."
                }
            })
        ]
        console.log(this.notes)
    }

    /**
     * Resize sidebar drawer to match the new content size
     */
    public resizeDrawers() {
        setTimeout(() => this.drawerResize.emit());
    }

    /** Confirm note deletion */
    public deleteNote(note: Note) {
        // open confirmation dialog
        let prompt = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: "35em",
            data: { 
                message: 'Are you sure you want to delete this note?',
            }
        });
  
        let subscription = prompt.afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    console.log("TODO: implement delete")
                    // this.restAPIConnectorService.deleteNote(note.stixID);
                }
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        });
    }

    /** TODO: implement on focus change (i.e. no longer editing) */
    onFocusOut(){
        // console.log(event)
        this.editing = false;
        // this.focusout.emit(event)
    }

    /** TODO: implement edit note */
    editChange() {
        this.editing = !this.editing;
    }
}
