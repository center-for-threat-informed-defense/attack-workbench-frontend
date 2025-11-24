import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { DescriptiveEditComponent } from './descriptive-edit.component';

describe('DescriptiveEditComponent', () => {
  let component: DescriptiveEditComponent;
  let fixture: ComponentFixture<DescriptiveEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptiveEditComponent],
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
    fixture = TestBed.createComponent(DescriptiveEditComponent);
    component = fixture.componentInstance;
    component.config = {
      mode: 'edit',
      object: {} as any,
      field: 'description',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
