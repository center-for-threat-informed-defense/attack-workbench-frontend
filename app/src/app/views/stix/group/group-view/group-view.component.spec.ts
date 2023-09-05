import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupViewComponent } from './group-view.component';

describe('GroupViewComponent', () => {
  let component: GroupViewComponent;
  let fixture: ComponentFixture<GroupViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
