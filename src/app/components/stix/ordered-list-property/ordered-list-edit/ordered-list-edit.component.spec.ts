import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedListEditComponent } from './ordered-list-edit.component';

describe('OrderedListEditComponent', () => {
  let component: OrderedListEditComponent;
  let fixture: ComponentFixture<OrderedListEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderedListEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
