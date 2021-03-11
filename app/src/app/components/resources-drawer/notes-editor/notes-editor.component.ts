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
    public notes: Note[];
    public objectStixID: string;

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
        this.objectStixID = this.router.url.split("/")[2].split("?")[0];
        this.notes = notes.filter(note => note.object_refs.includes(this.objectStixID));
        console.log(this.notes);
    }

    /**
     * Resize sidebar drawer to match the new content size
     */
    public resizeDrawers(): void {
        setTimeout(() => this.drawerResize.emit());
    }

    /** Add new note */
    public addNote(): void {
        let newNote = new Note();
        newNote.object_refs.push(this.objectStixID);
        // FIXME: open on edit mode
        newNote.editing = true;
        this.notes.unshift(newNote);
    }

    /** Confirm note deletion */
    public deleteNote(note: Note): void {
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
                    // remove note from list
                    let i = this.notes.indexOf(note);
                    if (i >= 0) this.notes.splice(i, 1);

                    // delete note
                    this.restAPIConnectorService.deleteNote(note.stixID); //FIXME: not currently implemented
                }
            },
            complete: () => { subscription.unsubscribe(); } //prevent memory leaks
        });
    }
    
    /** Save note */
    public saveNote(note: Note): void {
        note.editing = false;
        note.save(true, this.restAPIConnectorService);
    }

    /** TODO: sort by title */
    public sortTitle() {

    }
    /** TODO: sort by modified date */
    public sortDate() {

    }
    /** TODO: search notes */
    public search() {

    }
}
