import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SubheadingComponent } from './subheading.component';

describe('SubheadingComponent', () => {
  let component: SubheadingComponent;
  let fixture: ComponentFixture<SubheadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubheadingComponent],
      imports: [MtxPopoverModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubheadingComponent);
    component = fixture.componentInstance;
    component.config = { object: {} };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
