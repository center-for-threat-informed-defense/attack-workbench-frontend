import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReferencesDiffComponent } from './external-references-diff.component';

describe('ExternalReferencesDiffComponent', () => {
  let component: ExternalReferencesDiffComponent;
  let fixture: ComponentFixture<ExternalReferencesDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalReferencesDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalReferencesDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
