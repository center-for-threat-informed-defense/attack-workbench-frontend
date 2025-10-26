import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { NotesEditorComponent } from './notes-editor.component';

describe('NotesEditorComponent', () => {
  let component: NotesEditorComponent;
  let fixture: ComponentFixture<NotesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotesEditorComponent],
      providers: [
        provideHttpClient(),
        {
          provide: Router,
          useValue: {
            url: '/test/mock-id?param=value',
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
