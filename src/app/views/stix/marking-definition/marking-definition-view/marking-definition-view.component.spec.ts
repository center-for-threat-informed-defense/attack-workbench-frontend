import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingDefinitionViewComponent } from './marking-definition-view.component';

describe('MarkingDefinitionViewComponent', () => {
  let component: MarkingDefinitionViewComponent;
  let fixture: ComponentFixture<MarkingDefinitionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkingDefinitionViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingDefinitionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
