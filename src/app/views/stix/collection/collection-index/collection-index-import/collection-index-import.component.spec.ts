import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionIndexImportComponent } from './collection-index-import.component';

describe('CollectionIndexImportComponent', () => {
  let component: CollectionIndexImportComponent;
  let fixture: ComponentFixture<CollectionIndexImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionIndexImportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionIndexImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
