import { Component, Input } from '@angular/core';
import { StixObject } from 'src/app/classes/stix';

@Component({
  selector: 'app-dictionary-property',
  standalone: false,
  templateUrl: './dictionary-property.component.html',
  styleUrls: ['./dictionary-property.component.scss'],
})
export class DictionaryPropertyComponent {
  @Input() public config: DictionaryPropertyConfig;
}

export interface DictionaryPropertyConfig {
  /* What is the current mode? Default: 'view' */
  mode?: 'view' | 'edit' | 'diff';
  /* The object list to display in the table */
  objectList: object[];
  /* The fields to display as columns in the table */
  columns: DictionaryColumn[];
  /* The label for the table */
  label: string;
  /* The tooltip for the add button/edit dialog */
  tooltip: string;
}

interface DictionaryColumn {
  name: string;
  label?: string; // default name
  editType: 'string' | 'description' | 'select' | 'autocomplete';
  required?: boolean; // default false
  sort?: boolean; // default false
}
