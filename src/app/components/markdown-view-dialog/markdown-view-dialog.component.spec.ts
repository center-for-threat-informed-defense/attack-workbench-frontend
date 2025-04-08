import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownViewDialogComponent } from './markdown-view-dialog.component';

describe('MarkdownViewDialogComponent', () => {
  let component: MarkdownViewDialogComponent;
  let fixture: ComponentFixture<MarkdownViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkdownViewDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
