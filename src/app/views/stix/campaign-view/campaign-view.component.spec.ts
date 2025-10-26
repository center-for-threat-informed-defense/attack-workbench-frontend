import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CampaignViewComponent } from './campaign-view.component';

describe('CampaignViewComponent', () => {
  let component: CampaignViewComponent;
  let fixture: ComponentFixture<CampaignViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignViewComponent);
    component = fixture.componentInstance;
    component.config = { mode: 'view', object: {} as any };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
