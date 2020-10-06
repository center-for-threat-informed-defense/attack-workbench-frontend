import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareEditComponent } from './software-edit.component';

describe('SoftwareEditComponent', () => {
  let component: SoftwareEditComponent;
  let fixture: ComponentFixture<SoftwareEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
