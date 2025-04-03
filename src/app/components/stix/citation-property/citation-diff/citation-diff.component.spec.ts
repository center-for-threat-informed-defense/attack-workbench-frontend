import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationDiffComponent } from './citation-diff.component';

describe('CitationDiffComponent', () => {
  let component: CitationDiffComponent;
  let fixture: ComponentFixture<CitationDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitationDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitationDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
