import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackidEditComponent } from './attackid-edit.component';

describe('AttackidEditComponent', () => {
  let component: AttackidEditComponent;
  let fixture: ComponentFixture<AttackidEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackidEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackidEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
