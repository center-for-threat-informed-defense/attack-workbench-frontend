import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypePropertyComponent } from './subtype-property.component';

describe('SubtypePropertyComponent', () => {
  let component: SubtypePropertyComponent;
  let fixture: ComponentFixture<SubtypePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtypePropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtypePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
