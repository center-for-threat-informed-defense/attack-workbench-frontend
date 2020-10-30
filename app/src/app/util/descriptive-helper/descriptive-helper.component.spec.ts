import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptiveHelperComponent } from './descriptive-helper.component';

describe('DescriptiveHelperComponent', () => {
  let component: DescriptiveHelperComponent;
  let fixture: ComponentFixture<DescriptiveHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptiveHelperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptiveHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
