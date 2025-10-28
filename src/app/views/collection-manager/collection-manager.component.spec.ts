import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { CollectionManagerComponent } from './collection-manager.component';

describe('CollectionManagerComponent', () => {
  let component: CollectionManagerComponent;
  let fixture: ComponentFixture<CollectionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionManagerComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
