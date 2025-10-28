import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { StatementPropertyComponent } from './statement-property.component';

describe('StatementPropertyComponent', () => {
  let component: StatementPropertyComponent;
  let fixture: ComponentFixture<StatementPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatementPropertyComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
