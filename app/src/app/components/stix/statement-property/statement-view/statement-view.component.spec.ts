import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementViewComponent } from './statement-view.component';

describe('StatementViewComponent', () => {
  let component: StatementViewComponent;
  let fixture: ComponentFixture<StatementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
