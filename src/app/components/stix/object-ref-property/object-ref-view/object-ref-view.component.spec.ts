import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRefViewComponent } from './object-ref-view.component';

describe('ObjectRefViewComponent', () => {
  let component: ObjectRefViewComponent;
  let fixture: ComponentFixture<ObjectRefViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectRefViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectRefViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
