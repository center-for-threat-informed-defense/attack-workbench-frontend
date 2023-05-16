import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsListPageComponent } from './teams-list-page.component';

describe('TeamsListPageComponent', () => {
  let component: TeamsListPageComponent;
  let fixture: ComponentFixture<TeamsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
