import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedListPropertyComponent } from './ordered-list-property.component';

describe('OrderedListPropertyComponent', () => {
  let component: OrderedListPropertyComponent;
  let fixture: ComponentFixture<OrderedListPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderedListPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedListPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
