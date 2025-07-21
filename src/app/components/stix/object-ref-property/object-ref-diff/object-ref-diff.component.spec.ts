import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRefDiffComponent } from './object-ref-diff.component';

describe('ObjectRefDiffComponent', () => {
  let component: ObjectRefDiffComponent;
  let fixture: ComponentFixture<ObjectRefDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectRefDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectRefDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
