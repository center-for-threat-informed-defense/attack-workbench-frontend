import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationViewComponent } from './mitigation-view.component';

describe('MitigationViewComponent', () => {
  let component: MitigationViewComponent;
  let fixture: ComponentFixture<MitigationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationViewComponent ]
    })
    .compileComponents();
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
