import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TechniqueViewComponent } from './technique-view.component';

describe('TechniqueViewComponent', () => {
  let component: TechniqueViewComponent;
  let fixture: ComponentFixture<TechniqueViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TechniqueViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechniqueViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
