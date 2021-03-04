import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from 'src/app/classes/stix/note';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-notes-editor',
    templateUrl: './notes-editor.component.html',
    styleUrls: ['./notes-editor.component.scss']
})
export class NotesEditorComponent implements OnInit {
    @Output() public drawerResize = new EventEmitter();
    
    public loading: boolean = false;
    public editing: boolean = false;
    public notes: Note[];

    constructor(private router: Router, private restAPIConnectorService: RestApiConnectorService) { }

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
        let objectStixID = this.router.url.split("/")[2];
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

    /** TODO: implement delete note */
    public deleteNote(note: Note) {
        console.log("TODO")
    }

    /** TODO: implement on focus change */
    onFocusOut(){
        console.log(event)
        this.editing = false;
        // this.focusout.emit(event)
    }

    /** TODO: implement edit note */
    editChange() {
        this.editing = !this.editing;
    }
}
