import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementPropertyComponent } from './statement-property.component';

describe('StatementPropertyComponent', () => {
  let component: StatementPropertyComponent;
  let fixture: ComponentFixture<StatementPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatementPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
