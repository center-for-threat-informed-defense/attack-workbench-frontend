import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorEditDialogComponent } from './contributor-edit-dialog.component';

describe('ContributorEditDialogComponent', () => {
  let component: ContributorEditDialogComponent;
  let fixture: ComponentFixture<ContributorEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContributorEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
