import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignViewComponent } from './campaign-view.component';

describe('CampaignViewComponent', () => {
  let component: CampaignViewComponent;
  let fixture: ComponentFixture<CampaignViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
