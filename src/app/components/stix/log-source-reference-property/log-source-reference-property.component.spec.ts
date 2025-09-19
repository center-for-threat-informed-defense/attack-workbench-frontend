import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceReferencePropertyComponent } from './log-source-reference-property.component';

describe('LogSourceReferencePropertyComponent', () => {
  let component: LogSourceReferencePropertyComponent;
  let fixture: ComponentFixture<LogSourceReferencePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceReferencePropertyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceReferencePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
