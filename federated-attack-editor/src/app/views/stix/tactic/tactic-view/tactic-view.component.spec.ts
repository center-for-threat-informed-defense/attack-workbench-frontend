import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticViewComponent } from './tactic-view.component';

describe('TacticViewComponent', () => {
  let component: TacticViewComponent;
  let fixture: ComponentFixture<TacticViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TacticViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TacticViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
