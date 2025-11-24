import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { SoftwareViewComponent } from './software-view.component';
import { Software } from 'src/app/classes/stix/software';

describe('SoftwareViewComponent', () => {
  let component: SoftwareViewComponent;
  let fixture: ComponentFixture<SoftwareViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SoftwareViewComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareViewComponent);
    component = fixture.componentInstance;
    // Set required config input with a mock Software object
    const mockSoftware = new Software('malware');
    mockSoftware.firstInitialized = false; // Avoid triggering setDefaultMarkingDefinitions
    component.config = {
      mode: 'view',
      object: mockSoftware,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
