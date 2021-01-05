import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeViewComponent } from './type-view.component';

describe('TypeViewComponent', () => {
  let component: TypeViewComponent;
  let fixture: ComponentFixture<TypeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
