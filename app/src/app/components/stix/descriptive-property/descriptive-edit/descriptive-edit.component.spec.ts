import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptiveEditComponent } from './descriptive-edit.component';

describe('DescriptiveEditComponent', () => {
  let component: DescriptiveEditComponent;
  let fixture: ComponentFixture<DescriptiveEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptiveEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptiveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
