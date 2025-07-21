import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ObjectRefPropertyConfig } from '../object-ref-property.component';
import { MatDialog } from '@angular/material/dialog';
import { ObjectRefDialogComponent } from '../object-ref-dialog/object-ref-dialog.component';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-object-ref-edit',
  templateUrl: './object-ref-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ObjectRefEditComponent {
  @Input() public config: ObjectRefPropertyConfig;
  @Input() public attackObjects: StixObject[];

  public get objectRefs(): StixObject[] {
    const refIds = this.config.object[this.config.field].map(f => f.ref);
    return this.attackObjects.filter(o => refIds.includes(o.stixID));
  }

  constructor(public dialog: MatDialog) {}

  public removeRef(i: number): void {
    // remove object reference from field
    this.config.object[this.config.field].splice(i, 1);
  }

  public editObjectRef(i?: number) {
    const dialogRef = this.dialog.open(ObjectRefDialogComponent, {
      maxHeight: '75vh',
      data: {
        object: this.config.object,
        field: this.config.field,
        attackType: this.config.attackType,
        objectRefField: this.config.objectRefField,
        relatedFields: this.config.relatedFields,
        index: i,
      },
      autoFocus: false, // prevents auto focus on form fields
    });
    const subscription = dialogRef.afterClosed().subscribe({
      complete: () => subscription.unsubscribe(),
    });
  }
}
