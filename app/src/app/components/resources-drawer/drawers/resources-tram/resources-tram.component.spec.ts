import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesTramComponent } from './resources-tram.component';

describe('ResourcesTramComponent', () => {
  let component: ResourcesTramComponent;
  let fixture: ComponentFixture<ResourcesTramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesTramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesTramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
