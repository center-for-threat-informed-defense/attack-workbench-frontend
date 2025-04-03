import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasViewComponent } from './alias-view.component';

describe('AliasViewComponent', () => {
  let component: AliasViewComponent;
  let fixture: ComponentFixture<AliasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AliasViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
