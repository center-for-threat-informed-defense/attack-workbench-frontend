import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CollectionIndexViewComponent } from './collection-index-view.component';

describe('CollectionIndexViewComponent', () => {
  let component: CollectionIndexViewComponent;
  let fixture: ComponentFixture<CollectionIndexViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionIndexViewComponent],
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
    fixture = TestBed.createComponent(CollectionIndexViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
