import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptiveDiffComponent } from './descriptive-diff.component';

describe('DescriptiveDiffComponent', () => {
  let component: DescriptiveDiffComponent;
  let fixture: ComponentFixture<DescriptiveDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptiveDiffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptiveDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
