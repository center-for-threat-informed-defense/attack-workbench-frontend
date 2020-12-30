import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionExportedListComponent } from './collection-exported-list.component';

describe('CollectionExportedListComponent', () => {
  let component: CollectionExportedListComponent;
  let fixture: ComponentFixture<CollectionExportedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionExportedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionExportedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
