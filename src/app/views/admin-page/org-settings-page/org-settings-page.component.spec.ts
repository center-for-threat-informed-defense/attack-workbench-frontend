import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSettingsPageComponent } from './org-settings-page.component';

describe('OrgSettingsPageComponent', () => {
  let component: OrgSettingsPageComponent;
  let fixture: ComponentFixture<OrgSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSettingsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
