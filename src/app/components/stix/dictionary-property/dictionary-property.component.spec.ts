import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryPropertyComponent } from './dictionary-property.component';

describe('DictionaryPropertyComponent', () => {
  let component: DictionaryPropertyComponent;
  let fixture: ComponentFixture<DictionaryPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DictionaryPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictionaryPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
