import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceSidebarComponent } from './reference-sidebar.component';

describe('ReferenceManagerComponent', () => {
  let component: ReferenceSidebarComponent;
  let fixture: ComponentFixture<ReferenceSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceSidebarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
