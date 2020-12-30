import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionImportedListComponent } from './collection-imported-list.component';

describe('CollectionImportedListComponent', () => {
  let component: CollectionImportedListComponent;
  let fixture: ComponentFixture<CollectionImportedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionImportedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionImportedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
