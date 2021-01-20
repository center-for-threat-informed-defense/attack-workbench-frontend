import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionPropertyComponent } from './version-property.component';

describe('VersionPropertyComponent', () => {
  let component: VersionPropertyComponent;
  let fixture: ComponentFixture<VersionPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
