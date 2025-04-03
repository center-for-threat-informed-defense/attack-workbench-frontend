import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesEditorComponent } from './notes-editor.component';

describe('NotesEditorComponent', () => {
  let component: NotesEditorComponent;
  let fixture: ComponentFixture<NotesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesEditorComponent ]
    })
    .compileComponents();
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
