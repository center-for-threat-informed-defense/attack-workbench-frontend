import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryViewComponent } from './dictionary-view.component';

describe('DictionaryViewComponent', () => {
  let component: DictionaryViewComponent;
  let fixture: ComponentFixture<DictionaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DictionaryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictionaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
