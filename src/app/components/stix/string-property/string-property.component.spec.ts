import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { StixObject } from 'src/app/classes/stix/stix-object';

import { StringPropertyComponent } from './string-property.component';

describe('StringPropertyComponent', () => {
  let component: StringPropertyComponent;
  let fixture: ComponentFixture<StringPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StringPropertyComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringPropertyComponent);
    component = fixture.componentInstance;
    component.config = {
      mode: 'view',
      object: { stixID: 'test-stix-id' } as StixObject,
      field: 'name',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
