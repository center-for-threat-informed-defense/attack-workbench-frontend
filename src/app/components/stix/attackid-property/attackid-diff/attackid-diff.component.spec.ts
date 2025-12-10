import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AttackidDiffComponent } from './attackid-diff.component';

describe('AttackidDiffComponent', () => {
  let component: AttackidDiffComponent;
  let fixture: ComponentFixture<AttackidDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackidDiffComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackidDiffComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'diff', object: [{}, {}] as any };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
