import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ListEditComponent } from './list-edit.component';

describe('ListEditComponent', () => {
  let component: ListEditComponent;
  let fixture: ComponentFixture<ListEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListEditComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEditComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'edit', object: {} as any, field: 'platforms' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
