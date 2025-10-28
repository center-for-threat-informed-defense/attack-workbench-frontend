import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AddRelationshipButtonComponent } from './add-relationship-button.component';

describe('AddRelationshipButtonComponent', () => {
  let component: AddRelationshipButtonComponent;
  let fixture: ComponentFixture<AddRelationshipButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRelationshipButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelationshipButtonComponent);
    component = fixture.componentInstance;
    component.config = {
      label: 'test label',
      relationship_type: 'test-relationship',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
