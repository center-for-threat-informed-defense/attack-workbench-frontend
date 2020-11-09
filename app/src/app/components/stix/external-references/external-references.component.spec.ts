import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReferencesComponent } from './external-references.component';

describe('ExternalReferencesComponent', () => {
  let component: ExternalReferencesComponent;
  let fixture: ComponentFixture<ExternalReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
