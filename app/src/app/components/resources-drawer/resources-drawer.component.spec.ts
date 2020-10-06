import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesDrawerComponent } from './resources-drawer.component';

describe('ResourcesDrawerComponent', () => {
  let component: ResourcesDrawerComponent;
  let fixture: ComponentFixture<ResourcesDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
