import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationResultsComponent } from './validation-results.component';

describe('ValidationResultsComponent', () => {
  let component: ValidationResultsComponent;
  let fixture: ComponentFixture<ValidationResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
