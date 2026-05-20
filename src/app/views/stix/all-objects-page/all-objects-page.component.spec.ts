import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllObjectsPageComponent } from './all-objects-page.component';

describe('AllObjectsPageComponent', () => {
  let component: AllObjectsPageComponent;
  let fixture: ComponentFixture<AllObjectsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllObjectsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllObjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
