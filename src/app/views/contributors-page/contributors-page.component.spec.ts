import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ContributorsPageComponent } from './contributors-page.component';

describe('ContributorsPageComponent', () => {
  let component: ContributorsPageComponent;
  let fixture: ComponentFixture<ContributorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContributorsPageComponent],
      imports: [MtxPopoverModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
