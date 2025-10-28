import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { NamePropertyComponent } from './name-property.component';

describe('NamePropertyComponent', () => {
  let component: NamePropertyComponent;
  let fixture: ComponentFixture<NamePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NamePropertyComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamePropertyComponent);
    component = fixture.componentInstance;
    // Set required config input
    component.config = {
      mode: 'view',
      object: {} as any,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
