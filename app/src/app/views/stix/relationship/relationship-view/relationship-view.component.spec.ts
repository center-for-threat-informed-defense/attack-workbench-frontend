import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipViewComponent } from './relationship-view.component';

describe('RelationshipViewComponent', () => {
  let component: RelationshipViewComponent;
  let fixture: ComponentFixture<RelationshipViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
