import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamePropertyComponent } from './name-property.component';

describe('NamePropertyComponent', () => {
  let component: NamePropertyComponent;
  let fixture: ComponentFixture<NamePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NamePropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
