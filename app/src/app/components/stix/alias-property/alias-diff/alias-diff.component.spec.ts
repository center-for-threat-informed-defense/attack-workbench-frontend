import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasDiffComponent } from './alias-diff.component';

describe('AliasDiffComponent', () => {
  let component: AliasDiffComponent;
  let fixture: ComponentFixture<AliasDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AliasDiffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AliasDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
