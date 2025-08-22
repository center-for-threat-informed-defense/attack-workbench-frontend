import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRefEditComponent } from './object-ref-edit.component';

describe('ObjectRefEditComponent', () => {
  let component: ObjectRefEditComponent;
  let fixture: ComponentFixture<ObjectRefEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectRefEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectRefEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
