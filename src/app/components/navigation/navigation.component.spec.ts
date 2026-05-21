import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { NavigationComponent } from './navigation.component';
import { routes } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { createMockAuthenticationService } from 'src/app/testing/mocks/authentication-service.mock';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let authenticationService: any;

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
    authenticationService = TestBed.inject(AuthenticationService);
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

  it('should keep one parent navigation area expanded at a time', () => {
    authenticationService.isLoggedIn = true;

    expect(component.isNavigationAreaExpanded('objectLibrary')).toBe(true);

    component.expandNavigationArea('dashboard');
    expect(component.isNavigationAreaExpanded('objectLibrary')).toBe(false);
    expect(component.isNavigationAreaExpanded('dashboard')).toBe(true);
    expect(component.isNavigationAreaExpanded('documentation')).toBe(false);

    component.expandNavigationArea('documentation');
    expect(component.isNavigationAreaExpanded('objectLibrary')).toBe(false);
    expect(component.isNavigationAreaExpanded('dashboard')).toBe(false);
    expect(component.isNavigationAreaExpanded('documentation')).toBe(true);

    component.collapseNavigationGroups();
    expect(component.isNavigationAreaExpanded('objectLibrary')).toBe(false);
    expect(component.isNavigationAreaExpanded('dashboard')).toBe(false);
    expect(component.isNavigationAreaExpanded('documentation')).toBe(false);
  });

  it('should collapse restricted parent navigation areas when logged out', () => {
    expect(component.isNavigationAreaExpanded('objectLibrary')).toBe(false);

    component.expandNavigationArea('objectLibrary');
    expect(component.isNavigationAreaExpanded('objectLibrary')).toBe(false);

    component.expandNavigationArea('dashboard');
    expect(component.isNavigationAreaExpanded('dashboard')).toBe(false);
  });

  it('should allow documentation navigation to expand when logged out', () => {
    component.expandNavigationArea('documentation');

    expect(component.isNavigationAreaExpanded('documentation')).toBe(true);
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

  it('should mark documentation routes as active', () => {
    expect(component.isDocumentationRoute('/docs')).toBe(true);
    expect(component.isDocumentationRoute('/docs/usage')).toBe(true);
    expect(component.isDocumentationRoute('/docs/collections')).toBe(true);
    expect(component.isDocumentationRoute('/dashboard')).toBe(false);
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
    expect(component.dashboardItems[0]).toEqual(
      expect.objectContaining({
        label: 'Overview',
        path: '/dashboard/overview',
        exact: true,
      })
    );
    expect(component.dashboardAdminItems.map(item => item.label)).toEqual([
      'Organization Settings',
      'User Accounts',
      'Default Marking Definitions',
    ]);
  });

  it('should redirect the dashboard index to overview', () => {
    const dashboardRoute = routes[0]?.children?.find(
      route => route.path === 'dashboard'
    );
    const indexRoute = dashboardRoute?.children?.find(
      route => route.path === ''
    );
    const overviewRoute = dashboardRoute?.children?.find(
      route => route.path === 'overview'
    );

    expect(indexRoute?.redirectTo).toBe('overview');
    expect(indexRoute?.pathMatch).toBe('full');
    expect(overviewRoute?.data?.breadcrumb).toBe('overview');
    expect(overviewRoute?.data?.title).toBe('Knowledge Base Overview');
  });

  it('should build documentation links', () => {
    expect(component.documentationItems.map(item => item.label)).toEqual([
      'Usage',
      'Collections',
      'Integrations',
      'Contributing',
    ]);
    expect(component.documentationItems.map(item => item.path)).toEqual([
      '/docs/usage',
      '/docs/collections',
      '/docs/integrations',
      '/docs/contributing',
    ]);
  });

  it('should redirect the documentation index to usage', () => {
    const documentationRoute = routes[0]?.children?.find(
      route => route.path === 'docs'
    );
    const indexRoute = documentationRoute?.children?.find(
      route => route.path === ''
    );

    expect(indexRoute?.redirectTo).toBe('usage');
    expect(indexRoute?.pathMatch).toBe('full');
  });
});
