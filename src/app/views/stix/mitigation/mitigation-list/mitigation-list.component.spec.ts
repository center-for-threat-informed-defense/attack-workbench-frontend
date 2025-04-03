import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MitigationListComponent } from './mitigation-list.component';

describe('MitigationListComponent', () => {
  let component: MitigationListComponent;
  let fixture: ComponentFixture<MitigationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MitigationListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
