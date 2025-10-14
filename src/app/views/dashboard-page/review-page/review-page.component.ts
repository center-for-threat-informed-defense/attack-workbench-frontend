import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { StixListConfig } from 'src/app/components/stix/stix-list/stix-list.component';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReviewPageComponent implements AfterViewInit {
  public config: StixListConfig = {
    filterList: ['workflow_status'],
    showFilters: true,
    showControls: true,
  };

  ngAfterViewInit(): void {
  }

}
