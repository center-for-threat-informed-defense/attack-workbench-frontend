import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedListViewComponent } from './ordered-list-view.component';

describe('OrderedListViewComponent', () => {
  let component: OrderedListViewComponent;
  let fixture: ComponentFixture<OrderedListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderedListViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
