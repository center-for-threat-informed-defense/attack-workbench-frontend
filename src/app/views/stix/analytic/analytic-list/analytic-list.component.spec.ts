import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticListComponent } from './analytic-list.component';

describe('AnalyticListComponent', () => {
  let component: AnalyticListComponent;
  let fixture: ComponentFixture<AnalyticListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
