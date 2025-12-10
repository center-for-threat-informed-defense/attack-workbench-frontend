import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackIDEditComponent } from './attackid-edit.component';
import { StixObject } from 'src/app/classes/stix/stix-object';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { createMockRestApiConnector } from 'src/app/testing/mocks/rest-api-connector.mock';

describe('AttackIDEditComponent', () => {
  let component: AttackIDEditComponent;
  let fixture: ComponentFixture<AttackIDEditComponent>;

  beforeEach(async () => {
    const mockRestApiConnector = createMockRestApiConnector({});

    await TestBed.configureTestingModule({
      declarations: [AttackIDEditComponent],
      providers: [{ provide: RestApiConnectorService, useValue: mockRestApiConnector }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackIDEditComponent);
    component = fixture.componentInstance;
    // Set required config input
    const mockObject = {
      firstInitialized: false,
      attackID: 'T0001',
    } as StixObject;
    component.config = {
      mode: 'edit',
      object: mockObject,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
