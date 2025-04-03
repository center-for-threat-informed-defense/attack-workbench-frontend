import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDialogComponent } from './create-new-dialog.component';

describe('CreateNewDialogComponent', () => {
  let component: CreateNewDialogComponent;
  let fixture: ComponentFixture<CreateNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
