import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionDiffComponent } from './version-diff.component';

describe('VersionDiffComponent', () => {
  let component: VersionDiffComponent;
  let fixture: ComponentFixture<VersionDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
