import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackidViewComponent } from './attackid-view.component';

describe('AttackidViewComponent', () => {
  let component: AttackidViewComponent;
  let fixture: ComponentFixture<AttackidViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackidViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackidViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
