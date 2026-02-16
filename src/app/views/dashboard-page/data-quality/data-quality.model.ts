import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataQualityComponent } from './data-quality.component';
import { AppStixListModule } from 'src/app/components/stix-list/stix-list.module'; // adjust path

@NgModule({
  declarations: [DataQualityComponent], // ✅ declare component here
  imports: [
    CommonModule,
    AppStixListModule, // import module for <app-stix-list>
  ],
  exports: [DataQualityComponent], // optional: export if used elsewhere
})
export class DataQualityModule {}
