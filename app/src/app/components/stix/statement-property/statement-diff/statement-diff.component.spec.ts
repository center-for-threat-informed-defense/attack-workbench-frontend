import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementDiffComponent } from './statement-diff.component';

describe('StatementDiffComponent', () => {
  let component: StatementDiffComponent;
  let fixture: ComponentFixture<StatementDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementDiffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
