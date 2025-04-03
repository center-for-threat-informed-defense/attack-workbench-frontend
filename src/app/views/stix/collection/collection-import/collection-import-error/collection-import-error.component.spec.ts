import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionImportErrorComponent } from './collection-import-error.component';

describe('CollectionImportErrorComponent', () => {
  let component: CollectionImportErrorComponent;
  let fixture: ComponentFixture<CollectionImportErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionImportErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionImportErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
