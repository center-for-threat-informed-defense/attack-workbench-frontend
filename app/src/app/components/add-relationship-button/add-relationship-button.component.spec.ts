import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelationshipButtonComponent } from './add-relationship-button.component';

describe('AddRelationshipButtonComponent', () => {
  let component: AddRelationshipButtonComponent;
  let fixture: ComponentFixture<AddRelationshipButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRelationshipButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelationshipButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
