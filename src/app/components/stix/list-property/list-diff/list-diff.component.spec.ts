import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDiffComponent } from './list-diff.component';

describe('ListDiffComponent', () => {
  let component: ListDiffComponent;
  let fixture: ComponentFixture<ListDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
