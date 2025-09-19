import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceReferenceEditComponent } from './log-source-reference-edit.component';

describe('LogSourceReferenceEditComponent', () => {
  let component: LogSourceReferenceEditComponent;
  let fixture: ComponentFixture<LogSourceReferenceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferenceEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceReferenceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
