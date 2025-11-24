import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MarkingDefinitionViewComponent } from './marking-definition-view.component';

describe('MarkingDefinitionViewComponent', () => {
  let component: MarkingDefinitionViewComponent;
  let fixture: ComponentFixture<MarkingDefinitionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkingDefinitionViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingDefinitionViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
