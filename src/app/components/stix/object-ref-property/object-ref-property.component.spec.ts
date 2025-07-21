import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRefPropertyComponent } from './object-ref-property.component';

describe('ObjectRefPropertyComponent', () => {
  let component: ObjectRefPropertyComponent;
  let fixture: ComponentFixture<ObjectRefPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectRefPropertyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectRefPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
