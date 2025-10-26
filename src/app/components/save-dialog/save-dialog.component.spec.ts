import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { vi } from 'vitest';

import { SaveDialogComponent } from './save-dialog.component';
import { VersionNumber } from 'src/app/classes/version-number';

describe('SaveDialogComponent', () => {
  let component: SaveDialogComponent;
  let fixture: ComponentFixture<SaveDialogComponent>;

  beforeEach(async () => {
    const mockObject = {
      version: new VersionNumber('1.0'),
      validate: vi.fn().mockReturnValue(
        of({
          errors: [],
          info: [],
        }).pipe(delay(0))
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [SaveDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            object: mockObject,
            versionAlreadyIncremented: false,
          },
        },
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
