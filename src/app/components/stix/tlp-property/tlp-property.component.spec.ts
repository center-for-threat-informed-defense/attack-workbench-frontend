import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { StixObject } from 'src/app/classes/stix/stix-object';

import { TlpPropertyComponent } from './tlp-property.component';

describe('TlpPropertyComponent', () => {
  let component: TlpPropertyComponent;
  let fixture: ComponentFixture<TlpPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TlpPropertyComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TlpPropertyComponent);
    component = fixture.componentInstance;
    component.config = {
      mode: 'view',
      object: { stixID: 'test-stix-id' } as StixObject,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
