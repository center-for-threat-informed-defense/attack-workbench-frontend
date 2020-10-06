import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StixListComponent } from './stix-list.component';

describe('StixListComponent', () => {
  let component: StixListComponent;
  let fixture: ComponentFixture<StixListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StixListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
