import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DictionaryPropertyConfig } from '../dictionary-property.component';

@Component({
  selector: 'app-dictionary-edit',
  standalone: false,
  templateUrl: './dictionary-edit.component.html',
  styleUrls: ['./dictionary-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DictionaryEditComponent implements OnInit {
  @Input() public config: DictionaryPropertyConfig;
  @ViewChild('editInput', { static: false }) editInput: ElementRef;

  public editingIdx: number;
  public editingCol: string;

  ngOnInit() {
    const sortColumn = this.config.columns.find(c => c.sort).name;
    if (sortColumn) {
      this.config.objectList.sort((a, b) => {
        const aValue = a[sortColumn] ?? '';
        const bValue = b[sortColumn] ?? '';
        return String(aValue).localeCompare(String(bValue), undefined, {
          sensitivity: 'base',
        });
      });
    }
  }

  public isEditing(index: number, column: string): boolean {
    return index === this.editingIdx && column === this.editingCol;
  }

  public getDisplayedColumns(): string[] {
    return [...this.config.columns.map(c => c.name), 'actions'];
  }

  stopEditing(): void {
    this.editingIdx = undefined;
    this.editingCol = undefined;
  }

  addRow(): void {
    const newRow = {};
    this.config.columns.forEach(column => {
      newRow[column.name] = '';
    });
    this.config.objectList.unshift(newRow as any);
    this.editCell(0, this.getDisplayedColumns()[0]);
  }

  editCell(index: number, column: string): void {
    this.editingIdx = index;
    this.editingCol = column;
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    });
  }

  deleteRow(index: number): void {
    this.config.objectList.splice(index, 1);
    this.stopEditing();
  }
}
