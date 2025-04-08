import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TechniqueListComponent } from './technique-list.component';

describe('TechniqueListComponent', () => {
  let component: TechniqueListComponent;
  let fixture: ComponentFixture<TechniqueListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TechniqueListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechniqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
