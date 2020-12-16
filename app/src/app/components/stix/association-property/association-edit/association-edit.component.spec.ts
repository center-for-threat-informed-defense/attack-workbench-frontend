import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationEditComponent } from './association-edit.component';

describe('AssociationEditComponent', () => {
  let component: AssociationEditComponent;
  let fixture: ComponentFixture<AssociationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
