import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackIDPropertyComponent } from './attackid-property.component';

describe('AttackIDPropertyComponent', () => {
  let component: AttackIDPropertyComponent;
  let fixture: ComponentFixture<AttackIDPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackIDPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackIDPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
