import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogSourceListComponent } from './log-source-list.component';

describe('LogSourceListComponent', () => {
  let component: LogSourceListComponent;
  let fixture: ComponentFixture<LogSourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogSourceListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
