import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionExportComponent } from './collection-export.component';

describe('CollectionExportComponent', () => {
  let component: CollectionExportComponent;
  let fixture: ComponentFixture<CollectionExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
