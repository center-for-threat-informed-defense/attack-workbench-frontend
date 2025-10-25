import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackIDEditComponent } from './attackid-edit.component';

describe('AttackIDEditComponent', () => {
  let component: AttackIDEditComponent;
  let fixture: ComponentFixture<AttackIDEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackIDEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackIDEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
