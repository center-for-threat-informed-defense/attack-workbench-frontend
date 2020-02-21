import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationEditComponent } from './mitigation-edit.component';

describe('MitigationEditComponent', () => {
  let component: MitigationEditComponent;
  let fixture: ComponentFixture<MitigationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
