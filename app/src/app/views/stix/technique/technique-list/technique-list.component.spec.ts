import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniqueListComponent } from './technique-list.component';

describe('TechniqueListComponent', () => {
  let component: TechniqueListComponent;
  let fixture: ComponentFixture<TechniqueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechniqueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechniqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
