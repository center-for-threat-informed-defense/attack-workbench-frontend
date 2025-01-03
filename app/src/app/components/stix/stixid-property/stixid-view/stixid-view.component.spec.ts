import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StixIDViewComponent } from './stixid-view.component';

describe('StixidViewComponent', () => {
  let component: StixIDViewComponent;
  let fixture: ComponentFixture<StixIDViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StixIDViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StixIDViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
