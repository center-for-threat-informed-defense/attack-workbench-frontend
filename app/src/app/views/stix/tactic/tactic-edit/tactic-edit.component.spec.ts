import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticEditComponent } from './tactic-edit.component';

describe('TacticEditComponent', () => {
  let component: TacticEditComponent;
  let fixture: ComponentFixture<TacticEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TacticEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TacticEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
