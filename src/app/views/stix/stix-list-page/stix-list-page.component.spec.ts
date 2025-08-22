import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StixListPageComponent } from './stix-list-page.component';

describe('StixListPageComponent', () => {
  let component: StixListPageComponent;
  let fixture: ComponentFixture<StixListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StixListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StixListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
