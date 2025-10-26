import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';

import { ReferenceEditDialogComponent } from './reference-edit-dialog.component';

describe('ReferenceEditDialogComponent', () => {
  let component: ReferenceEditDialogComponent;
  let fixture: ComponentFixture<ReferenceEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceEditDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'view',
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
