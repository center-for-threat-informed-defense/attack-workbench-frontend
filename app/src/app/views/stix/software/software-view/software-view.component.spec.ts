import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoftwareViewComponent } from './software-view.component';

describe('SoftwareViewComponent', () => {
  let component: SoftwareViewComponent;
  let fixture: ComponentFixture<SoftwareViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
