import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackidPropertyComponent } from './attackid-property.component';

describe('AttackidPropertyComponent', () => {
  let component: AttackidPropertyComponent;
  let fixture: ComponentFixture<AttackidPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackidPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackidPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
