import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { IdentityPropertyComponent } from './identity-property.component';

describe('IdentityPropertyComponent', () => {
  let component: IdentityPropertyComponent;
  let fixture: ComponentFixture<IdentityPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentityPropertyComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityPropertyComponent);
    component = fixture.componentInstance;
    // Set required config input
    component.config = {
      object: {} as any,
      field: 'identity',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
