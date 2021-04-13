import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgIdentityPageComponent } from './org-identity-page.component';

describe('OrgIdentityPageComponent', () => {
  let component: OrgIdentityPageComponent;
  let fixture: ComponentFixture<OrgIdentityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgIdentityPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgIdentityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
