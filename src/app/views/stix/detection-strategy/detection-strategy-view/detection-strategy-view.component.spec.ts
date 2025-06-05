import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionStrategyViewComponent } from './detection-strategy-view.component';

describe('DetectionStrategyViewComponent', () => {
  let component: DetectionStrategyViewComponent;
  let fixture: ComponentFixture<DetectionStrategyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetectionStrategyViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectionStrategyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
