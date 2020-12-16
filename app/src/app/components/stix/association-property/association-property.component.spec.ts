import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationPropertyComponent } from './association-property.component';

describe('AssociationPropertyComponent', () => {
  let component: AssociationPropertyComponent;
  let fixture: ComponentFixture<AssociationPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
