import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackidDiffComponent } from './attackid-diff.component';

describe('AttackidDiffComponent', () => {
  let component: AttackidDiffComponent;
  let fixture: ComponentFixture<AttackidDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackidDiffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttackidDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
