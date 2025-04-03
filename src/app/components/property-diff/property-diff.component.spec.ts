import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDiffComponent } from './property-diff.component';

describe('PropertyDiffComponent', () => {
  let component: PropertyDiffComponent;
  let fixture: ComponentFixture<PropertyDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyDiffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertyDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
