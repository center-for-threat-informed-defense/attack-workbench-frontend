import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlpPropertyComponent } from './tlp-property.component';

describe('TlpPropertyComponent', () => {
  let component: TlpPropertyComponent;
  let fixture: ComponentFixture<TlpPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TlpPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TlpPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
