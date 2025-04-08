import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasEditComponent } from './alias-edit.component';

describe('AliasEditComponent', () => {
  let component: AliasEditComponent;
  let fixture: ComponentFixture<AliasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AliasEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
