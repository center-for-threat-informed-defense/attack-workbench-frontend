import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReferencesViewComponent } from './external-references-view.component';

describe('ExternalReferencesViewComponent', () => {
  let component: ExternalReferencesViewComponent;
  let fixture: ComponentFixture<ExternalReferencesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalReferencesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReferencesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
