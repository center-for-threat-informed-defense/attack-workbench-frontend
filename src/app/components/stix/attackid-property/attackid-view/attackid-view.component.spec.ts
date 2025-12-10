import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackIDViewComponent } from './attackid-view.component';
import { StixObject } from 'src/app/classes/stix/stix-object';

describe('AttackidViewComponent', () => {
  let component: AttackIDViewComponent;
  let fixture: ComponentFixture<AttackIDViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackIDViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackIDViewComponent);
    component = fixture.componentInstance;
    // Set required config input
    component.config = {
      mode: 'view',
      object: {} as StixObject,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
