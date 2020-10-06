import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StixCardComponent } from './stix-card.component';

describe('StixCardComponent', () => {
  let component: StixCardComponent;
  let fixture: ComponentFixture<StixCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StixCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StixCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
