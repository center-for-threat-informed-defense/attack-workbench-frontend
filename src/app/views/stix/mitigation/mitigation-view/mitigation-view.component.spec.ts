import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MitigationViewComponent } from './mitigation-view.component';

describe('MitigationViewComponent', () => {
  let component: MitigationViewComponent;
  let fixture: ComponentFixture<MitigationViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MitigationViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
