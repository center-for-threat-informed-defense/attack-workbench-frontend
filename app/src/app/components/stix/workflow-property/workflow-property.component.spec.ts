import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPropertyComponent } from './workflow-property.component';

describe('WorkflowPropertyComponent', () => {
  let component: WorkflowPropertyComponent;
  let fixture: ComponentFixture<WorkflowPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
