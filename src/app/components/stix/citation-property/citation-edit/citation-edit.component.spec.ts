import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CitationEditComponent } from './citation-edit.component';

describe('CitationEditComponent', () => {
  let component: CitationEditComponent;
  let fixture: ComponentFixture<CitationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitationEditComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitationEditComponent);
    component = fixture.componentInstance;
    component.config = {
      mode: 'edit',
      object: {} as any,
      field: 'external_references',
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
