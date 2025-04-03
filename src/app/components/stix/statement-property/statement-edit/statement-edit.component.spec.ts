import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementEditComponent } from './statement-edit.component';

describe('StatementEditComponent', () => {
  let component: StatementEditComponent;
  let fixture: ComponentFixture<StatementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
