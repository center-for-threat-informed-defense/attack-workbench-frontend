import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { NavigationComponent } from './navigation.component';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { createMockAuthenticationService } from 'src/app/testing/mocks/authentication-service.mock';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [MatDividerModule, MatIconModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: AuthenticationService,
          useValue: createMockAuthenticationService({}),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle navigation sections', () => {
    expect(component.isSectionOpen('Core')).toBe(true);

    component.toggleSection('Core');
    expect(component.isSectionOpen('Core')).toBe(false);

    component.toggleSection('Core');
    expect(component.isSectionOpen('Core')).toBe(true);
  });

  it('should collapse and expand object library children', () => {
    expect(component.objectLibraryExpanded).toBe(true);

    component.collapseObjectLibrary();
    expect(component.objectLibraryExpanded).toBe(false);

    component.expandObjectLibrary();
    expect(component.objectLibraryExpanded).toBe(true);
    expect(component.dashboardExpanded).toBe(false);
  });

  it('should collapse and expand dashboard children', () => {
    component.expandDashboard();
    expect(component.dashboardExpanded).toBe(true);
    expect(component.objectLibraryExpanded).toBe(false);

    component.collapseDashboard();
    expect(component.dashboardExpanded).toBe(false);
  });

  it('should mark object library routes as active', () => {
    expect(component.isObjectLibraryRoute('/objects')).toBe(true);
    expect(component.isObjectLibraryRoute('/technique')).toBe(true);
    expect(
      component.isObjectLibraryRoute('/technique/attack-pattern--123')
    ).toBe(true);
    expect(component.isObjectLibraryRoute('/reference-manager')).toBe(false);
  });

  it('should mark dashboard routes as active', () => {
    expect(component.isDashboardRoute('/dashboard')).toBe(true);
    expect(component.isDashboardRoute('/dashboard/release-management')).toBe(
      true
    );
    expect(
      component.isDashboardRoute('/dashboard/release-management/123')
    ).toBe(true);
    expect(component.isDashboardRoute('/objects')).toBe(false);
  });

  it('should use title-cased route breadcrumbs for object labels', () => {
    const ctiSection = component.sections.find(
      section => section.label === 'CTI'
    );
    const defenseSection = component.sections.find(
      section => section.label === 'Defenses'
    );

    expect(ctiSection?.items.map(item => item.label)).toContain('Software');
    expect(defenseSection?.items.map(item => item.label)).toContain(
      'Data Components'
    );
  });

  it('should build section labels from route groups', () => {
    expect(component.sections.map(section => section.label)).toEqual([
      'Core',
      'CTI',
      'Defenses',
      'More',
    ]);
  });

  it('should build dashboard links with admin links grouped separately', () => {
    expect(component.dashboardItems.map(item => item.label)).toEqual([
      'Overview',
      'Release Management',
      'Teams',
      'Data Quality',
    ]);
    expect(component.dashboardAdminItems.map(item => item.label)).toEqual([
      'Organization Settings',
      'User Accounts',
      'Default Marking Definitions',
    ]);
  });
});
