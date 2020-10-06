import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniqueEditComponent } from './technique-edit.component';

describe('TechniqueEditComponent', () => {
  let component: TechniqueEditComponent;
  let fixture: ComponentFixture<TechniqueEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechniqueEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechniqueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
