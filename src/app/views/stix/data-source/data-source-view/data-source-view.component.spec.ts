import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourceViewComponent } from './data-source-view.component';

describe('DataSourceViewComponent', () => {
  let component: DataSourceViewComponent;
  let fixture: ComponentFixture<DataSourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSourceViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
