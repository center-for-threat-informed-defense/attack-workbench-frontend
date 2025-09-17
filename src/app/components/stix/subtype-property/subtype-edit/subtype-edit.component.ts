import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SubtypePropertyConfig } from '../subtype-property.component';
import { MatDialog } from '@angular/material/dialog';
import { SubtypeDialogComponent } from '../subtype-dialog/subtype-dialog.component';

@Component({
  selector: 'app-subtype-edit',
  templateUrl: './subtype-edit.component.html',
  styleUrls: ['./subtype-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SubtypeEditComponent {
  @Input() public config: SubtypePropertyConfig;

  /**
   * Get list of key values from subtype list
   */
  public get keyValues(): any[] {
    const key = this.config.subtypeFields.find(subtype => subtype.key).name;
    return this.config.object[this.config.field].map(value => value[key]);
  }

  constructor(public dialog: MatDialog) {
    // intentionally left blank
  }

  public getTooltip(i: number): string {
    const nonKeyFields = this.config.subtypeFields.filter(field => !field.key);
    const value = this.config.object[this.config.field][i];
    const fieldTooltips = nonKeyFields.map(
      field => `${field.label || field.name}: ${value[field.name]}`
    );
    return fieldTooltips.join(', ');
  }

  public removeValue(i: number): void {
    // remove subtype from field
    this.config.object[this.config.field].splice(i, 1);
  }

  /**
   * Open the edit dialog to create/edit the item
   * @param i the index of the selected item to edit; or, if none is
   * provided, create a new item
   */
  public editValue(i?: number): void {
    const ref = this.dialog.open(SubtypeDialogComponent, {
      maxHeight: '75vh',
      data: {
        object: this.config.object,
        field: this.config.field,
        index: i,
        subtypeFields: this.config.subtypeFields,
        tooltip: this.config.tooltip,
      },
    });
    const subscription = ref.afterClosed().subscribe({
      complete: () => {
        subscription.unsubscribe();
      },
    });
  }
}
