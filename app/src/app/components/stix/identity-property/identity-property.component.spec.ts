import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityPropertyComponent } from './identity-property.component';

describe('IdentityPropertyComponent', () => {
  let component: IdentityPropertyComponent;
  let fixture: ComponentFixture<IdentityPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
