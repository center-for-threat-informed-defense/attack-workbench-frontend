import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsViewPageComponent } from './teams-view-page.component';

describe('TeamsViewPageComponent', () => {
  let component: TeamsViewPageComponent;
  let fixture: ComponentFixture<TeamsViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsViewPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
