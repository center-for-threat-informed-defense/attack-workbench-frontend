import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlpEditComponent } from './tlp-edit.component';

describe('TlpEditComponent', () => {
  let component: TlpEditComponent;
  let fixture: ComponentFixture<TlpEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TlpEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TlpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
