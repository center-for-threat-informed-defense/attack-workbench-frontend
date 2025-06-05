import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionStrategyListComponent } from './detection-strategy-list.component';

describe('DetectionStrategyListComponent', () => {
  let component: DetectionStrategyListComponent;
  let fixture: ComponentFixture<DetectionStrategyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetectionStrategyListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetectionStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
