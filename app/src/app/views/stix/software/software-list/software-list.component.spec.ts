import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareListComponent } from './software-list.component';

describe('SoftwareListComponent', () => {
  let component: SoftwareListComponent;
  let fixture: ComponentFixture<SoftwareListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
