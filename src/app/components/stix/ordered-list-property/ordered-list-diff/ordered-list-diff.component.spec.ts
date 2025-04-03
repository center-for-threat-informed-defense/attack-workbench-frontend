import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedListDiffComponent } from './ordered-list-diff.component';

describe('OrderedListDiffComponent', () => {
  let component: OrderedListDiffComponent;
  let fixture: ComponentFixture<OrderedListDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderedListDiffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderedListDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
