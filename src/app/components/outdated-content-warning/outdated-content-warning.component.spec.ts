import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdatedContentWarningComponent } from './outdated-content-warning.component';

describe('OutdatedContentWarningComponent', () => {
  let component: OutdatedContentWarningComponent;
  let fixture: ComponentFixture<OutdatedContentWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutdatedContentWarningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutdatedContentWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
