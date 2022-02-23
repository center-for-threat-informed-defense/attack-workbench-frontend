import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMarkingDefinitionsComponent } from './default-marking-definitions.component';

describe('DefaultMarkingDefinitionsComponent', () => {
  let component: DefaultMarkingDefinitionsComponent;
  let fixture: ComponentFixture<DefaultMarkingDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultMarkingDefinitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultMarkingDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
