import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlpDiffComponent } from './tlp-diff.component';

describe('TlpDiffComponent', () => {
  let component: TlpDiffComponent;
  let fixture: ComponentFixture<TlpDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TlpDiffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TlpDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
