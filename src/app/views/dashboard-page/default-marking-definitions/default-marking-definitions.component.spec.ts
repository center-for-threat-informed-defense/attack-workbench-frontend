import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';

import { DefaultMarkingDefinitionsComponent } from './default-marking-definitions.component';

describe('DefaultMarkingDefinitionsComponent', () => {
  let component: DefaultMarkingDefinitionsComponent;
  let fixture: ComponentFixture<DefaultMarkingDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultMarkingDefinitionsComponent],
      imports: [MtxPopoverModule],
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
    fixture = TestBed.createComponent(DefaultMarkingDefinitionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
