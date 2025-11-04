import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryDiffComponent } from './dictionary-diff.component';

describe('DictionaryDiffComponent', () => {
  let component: DictionaryDiffComponent;
  let fixture: ComponentFixture<DictionaryDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DictionaryDiffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictionaryDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
