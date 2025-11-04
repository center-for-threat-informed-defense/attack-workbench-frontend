import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryEditComponent } from './dictionary-edit.component';

describe('DictionaryEditComponent', () => {
  let component: DictionaryEditComponent;
  let fixture: ComponentFixture<DictionaryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DictionaryEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DictionaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
