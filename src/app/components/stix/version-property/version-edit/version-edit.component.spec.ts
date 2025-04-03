import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionEditComponent } from './version-edit.component';

describe('VersionEditComponent', () => {
  let component: VersionEditComponent;
  let fixture: ComponentFixture<VersionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
