import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StixIDPropertyComponent } from './stixid-property.component';

describe('StixidPropertyComponent', () => {
  let component: StixIDPropertyComponent;
  let fixture: ComponentFixture<StixIDPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StixIDPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StixIDPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
