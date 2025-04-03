import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionIndexListComponent } from './collection-index-list.component';

describe('CollectionIndexListComponent', () => {
  let component: CollectionIndexListComponent;
  let fixture: ComponentFixture<CollectionIndexListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionIndexListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionIndexListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
