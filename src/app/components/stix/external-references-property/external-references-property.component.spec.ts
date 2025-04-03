import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReferencesPropertyComponent } from './external-references-property.component';

describe('ExternalReferencesPropertyComponent', () => {
  let component: ExternalReferencesPropertyComponent;
  let fixture: ComponentFixture<ExternalReferencesPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalReferencesPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReferencesPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
