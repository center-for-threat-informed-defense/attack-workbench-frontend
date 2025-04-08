import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatrixViewComponent } from './matrix-view.component';

describe('MatrixViewComponent', () => {
  let component: MatrixViewComponent;
  let fixture: ComponentFixture<MatrixViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatrixViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
