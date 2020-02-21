import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticListComponent } from './tactic-list.component';

describe('TacticListComponent', () => {
  let component: TacticListComponent;
  let fixture: ComponentFixture<TacticListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TacticListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TacticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
