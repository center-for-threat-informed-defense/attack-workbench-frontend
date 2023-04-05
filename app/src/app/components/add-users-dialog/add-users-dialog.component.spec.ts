import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsersDialogComponent } from './add-users-dialog.component';

describe('AddUsersDialogComponent', () => {
  let component: AddUsersDialogComponent;
  let fixture: ComponentFixture<AddUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUsersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
