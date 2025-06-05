import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticViewComponent } from './analytic-view.component';

describe('AnalyticViewComponent', () => {
  let component: AnalyticViewComponent;
  let fixture: ComponentFixture<AnalyticViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
