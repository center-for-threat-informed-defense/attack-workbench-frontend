import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrackPageComponent } from './release-track-page.component';

describe('ReleaseTrackPageComponent', () => {
  let component: ReleaseTrackPageComponent;
  let fixture: ComponentFixture<ReleaseTrackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReleaseTrackPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
