import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeDiffComponent } from './subtype-diff.component';

describe('SubtypeDiffComponent', () => {
  let component: SubtypeDiffComponent;
  let fixture: ComponentFixture<SubtypeDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtypeDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubtypeDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
