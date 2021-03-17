import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasEditDialogComponent } from './alias-edit-dialog.component';

describe('AliasAddDialogComponent', () => {
  let component: AliasEditDialogComponent;
  let fixture: ComponentFixture<AliasEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliasEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliasEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
