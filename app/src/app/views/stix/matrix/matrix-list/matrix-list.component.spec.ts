import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixListComponent } from './matrix-list.component';

describe('MatrixListComponent', () => {
  let component: MatrixListComponent;
  let fixture: ComponentFixture<MatrixListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
