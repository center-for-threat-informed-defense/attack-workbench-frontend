import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptivePropertyComponent } from './descriptive-property.component';

describe('DescriptivePropertyComponent', () => {
  let component: DescriptivePropertyComponent;
  let fixture: ComponentFixture<DescriptivePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptivePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptivePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
