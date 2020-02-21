import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniqueViewComponent } from './technique-view.component';

describe('TechniqueViewComponent', () => {
  let component: TechniqueViewComponent;
  let fixture: ComponentFixture<TechniqueViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechniqueViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechniqueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
