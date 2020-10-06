import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StixListCardsComponent } from './stix-list-cards.component';

describe('StixListCardsComponent', () => {
  let component: StixListCardsComponent;
  let fixture: ComponentFixture<StixListCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StixListCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StixListCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
