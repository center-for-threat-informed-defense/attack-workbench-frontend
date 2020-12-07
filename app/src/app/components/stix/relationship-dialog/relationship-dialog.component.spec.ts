import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipDialogComponent } from './relationship-dialog.component';

describe('RelationshipDialogComponent', () => {
  let component: RelationshipDialogComponent;
  let fixture: ComponentFixture<RelationshipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
