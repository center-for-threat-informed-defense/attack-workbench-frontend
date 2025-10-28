import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { DescriptiveViewComponent } from './descriptive-view.component';

describe('DescriptiveViewComponent', () => {
  let component: DescriptiveViewComponent;
  let fixture: ComponentFixture<DescriptiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptiveViewComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptiveViewComponent);
    component = fixture.componentInstance;
    // Set required config input
    component.config = {
      mode: 'view',
      object: {} as any,
      field: 'description',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
