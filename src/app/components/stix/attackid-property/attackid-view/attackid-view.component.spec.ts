import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackIDViewComponent } from './attackid-view.component';

describe('AttackidViewComponent', () => {
  let component: AttackIDViewComponent;
  let fixture: ComponentFixture<AttackIDViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackIDViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackIDViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
