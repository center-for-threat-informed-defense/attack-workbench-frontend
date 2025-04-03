import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StixPageComponent } from './stix-page.component';

describe('StixPageComponent', () => {
  let component: StixPageComponent;
  let fixture: ComponentFixture<StixPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StixPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StixPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
