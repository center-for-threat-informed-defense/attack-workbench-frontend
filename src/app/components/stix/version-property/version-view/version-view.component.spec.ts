import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionViewComponent } from './version-view.component';

describe('VersionViewComponent', () => {
  let component: VersionViewComponent;
  let fixture: ComponentFixture<VersionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
