import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionPopoverComponent } from './version-popover.component';

describe('VersionPopoverComponent', () => {
  let component: VersionPopoverComponent;
  let fixture: ComponentFixture<VersionPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
