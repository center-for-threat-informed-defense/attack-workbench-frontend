import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceManagerComponent } from './reference-manager.component';

describe('ReferenceManagerComponent', () => {
  let component: ReferenceManagerComponent;
  let fixture: ComponentFixture<ReferenceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
