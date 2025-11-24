import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DataSourceViewComponent } from './data-source-view.component';

describe('DataSourceViewComponent', () => {
  let component: DataSourceViewComponent;
  let fixture: ComponentFixture<DataSourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSourceViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
