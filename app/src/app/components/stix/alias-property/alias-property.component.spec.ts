import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasPropertyComponent } from './alias-property.component';

describe('AliasPropertyComponent', () => {
  let component: AliasPropertyComponent;
  let fixture: ComponentFixture<AliasPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliasPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AliasPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
