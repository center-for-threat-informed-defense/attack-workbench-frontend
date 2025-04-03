import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanPropertyComponent } from './boolean-property.component';

describe('BooleanPropertyComponent', () => {
  let component: BooleanPropertyComponent;
  let fixture: ComponentFixture<BooleanPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooleanPropertyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooleanPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
