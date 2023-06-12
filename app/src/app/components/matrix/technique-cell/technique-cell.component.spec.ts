import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniqueCellComponent } from './technique-cell.component';

describe('TechniqueCellComponent', () => {
  let component: TechniqueCellComponent;
  let fixture: ComponentFixture<TechniqueCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechniqueCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechniqueCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
