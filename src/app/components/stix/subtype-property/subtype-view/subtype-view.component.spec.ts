import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeViewComponent } from './subtype-view.component';

describe('SubtypeViewComponent', () => {
  let component: SubtypeViewComponent;
  let fixture: ComponentFixture<SubtypeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtypeViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
