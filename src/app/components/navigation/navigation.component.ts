import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { stixRoutes } from 'src/app/app-routing-stix.module';
import { Role } from 'src/app/classes/authn/role';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';

interface NavigationItem {
  label: string;
  path: string;
  deprecated?: boolean;
}

interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NavigationComponent {
  public objectLibraryExpanded = true;

  private readonly groupOrder = ['core', 'cti', 'defenses', 'more'];
  private readonly objectLibraryExcludedPaths = new Set([
    'objects',
    'reference-manager',
    'contributors',
  ]);
  private readonly uppercaseLabels = new Set(['cti']);
  private readonly collapsedSections = new Set<string>();

  public readonly sections: NavigationSection[] = this.buildSections();

  private readonly objectLibraryPaths = [
    '/objects',
    ...this.sections.reduce(
      (paths, section) => paths.concat(section.items.map(item => item.path)),
      [] as string[]
    ),
  ];

  public get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  public get canAccessDashboard(): boolean {
    return this.authenticationService.isAuthorized([
      Role.ADMIN,
      Role.TEAM_LEAD,
    ]);
  }

  public get isObjectLibraryActive(): boolean {
    return this.isObjectLibraryRoute(this.router.url);
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public collapseObjectLibrary(): void {
    this.objectLibraryExpanded = false;
  }

  public expandObjectLibrary(): void {
    this.objectLibraryExpanded = true;
  }

  public isSectionOpen(section: string): boolean {
    return !this.collapsedSections.has(section);
  }

  public sectionId(section: string): string {
    return `nav-section-${section.toLowerCase().replace(/\s+/g, '-')}`;
  }

  public toggleSection(section: string): void {
    if (this.collapsedSections.has(section)) {
      this.collapsedSections.delete(section);
    } else {
      this.collapsedSections.add(section);
    }
  }

  public isObjectLibraryRoute(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return this.objectLibraryPaths.some(
      objectPath => path === objectPath || path.startsWith(`${objectPath}/`)
    );
  }

  private buildSections(): NavigationSection[] {
    const itemsByGroup = new Map<string, NavigationItem[]>();

    stixRoutes
      .filter(
        route =>
          route.path &&
          route.data?.group &&
          !route.data?.deprecated &&
          !this.objectLibraryExcludedPaths.has(route.path)
      )
      .forEach(route => {
        const group = route.data?.group as string;
        const items = itemsByGroup.get(group) || [];
        items.push({
          label: this.titleCase(
            route.data?.breadcrumb || (route.path as string)
          ),
          path: `/${route.path}`,
          deprecated: !!route.data?.deprecated,
        });
        itemsByGroup.set(group, items);
      });

    return Array.from(itemsByGroup.entries())
      .sort(([leftGroup], [rightGroup]) => {
        const leftOrder = this.groupOrder.indexOf(leftGroup);
        const rightOrder = this.groupOrder.indexOf(rightGroup);
        return this.groupSortValue(leftOrder) - this.groupSortValue(rightOrder);
      })
      .map(([group, items]) => ({
        label: this.titleCase(group),
        items,
      }));
  }

  private groupSortValue(order: number): number {
    return order === -1 ? Number.MAX_SAFE_INTEGER : order;
  }

  private titleCase(value: string): string {
    return value
      .replace(/-/g, ' ')
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => {
        const lowerCaseWord = word.toLowerCase();
        if (this.uppercaseLabels.has(lowerCaseWord))
          return lowerCaseWord.toUpperCase();
        return `${lowerCaseWord.charAt(0).toUpperCase()}${lowerCaseWord.slice(1)}`;
      })
      .join(' ');
  }
}
