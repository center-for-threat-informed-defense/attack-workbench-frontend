import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DetectionStrategyViewComponent } from './detection-strategy-view.component';

describe('DetectionStrategyViewComponent', () => {
  let component: DetectionStrategyViewComponent;
  let fixture: ComponentFixture<DetectionStrategyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetectionStrategyViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetectionStrategyViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
