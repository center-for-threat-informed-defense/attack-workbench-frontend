import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollectionImportComponent } from './collection-import.component';

describe('CollectionImportComponent', () => {
  let component: CollectionImportComponent;
  let fixture: ComponentFixture<CollectionImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
