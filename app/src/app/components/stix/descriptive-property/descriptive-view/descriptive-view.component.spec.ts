import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptiveViewComponent } from './descriptive-view.component';

describe('DescriptiveViewComponent', () => {
  let component: DescriptiveViewComponent;
  let fixture: ComponentFixture<DescriptiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptiveViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
