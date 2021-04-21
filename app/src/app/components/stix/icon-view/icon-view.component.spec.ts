import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconViewComponent } from './icon-view.component';

describe('WorkflowPropertyComponent', () => {
  let component: IconViewComponent;
  let fixture: ComponentFixture<IconViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
