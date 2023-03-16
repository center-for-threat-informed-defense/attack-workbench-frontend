import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesSearchListComponent } from './notes-search-list.component';

describe('NotesSearchListComponent', () => {
  let component: NotesSearchListComponent;
  let fixture: ComponentFixture<NotesSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
