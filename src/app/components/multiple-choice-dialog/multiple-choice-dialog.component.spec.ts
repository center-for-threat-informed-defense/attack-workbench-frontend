import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceDialogComponent } from './multiple-choice-dialog.component';

describe('MultipleChoiceDialogComponent', () => {
  let component: MultipleChoiceDialogComponent;
  let fixture: ComponentFixture<MultipleChoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleChoiceDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
