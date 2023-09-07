import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, Route } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class BreadcrumbService {
	public onBreadcrumbChanged = new EventEmitter();
	private breadcrumbs: Breadcrumb[] = [];

	constructor(private router: Router) {
		this.router.events.subscribe((routeEvent) => {
			this.buildBreadcrumbs(routeEvent);
		});
	}

	// builds breadrumbs on route event
	private buildBreadcrumbs(routeEvent): void {
		if (!(routeEvent instanceof NavigationEnd)) return;

		let route = this.router.routerState.root.snapshot;
		let url = '';
		let newBreadcrumbs = [];

		while (route.firstChild) {
			route = route.firstChild;
            if (route.routeConfig === null) continue;
            if (!route.routeConfig.path) continue;
			url += `/${this.getBreadcrumbUrl(route)}`;
			if (!route.data.breadcrumb) continue;

			let isEnd = route.firstChild === null || route.firstChild.routeConfig === null || !route.firstChild.routeConfig.path;
			let newBreadcrumb = {
				name: route.data.breadcrumb,
				end: isEnd,
				url: url,
				route: route.routeConfig
			}
			newBreadcrumbs.push(newBreadcrumb);
		}

		this.breadcrumbs = newBreadcrumbs;
		this.onBreadcrumbChanged.emit(this.breadcrumbs);
	}

	// change the breadcrumb name
    public changeBreadcrumb(route: ActivatedRouteSnapshot, name: string): void {
        const resolvedUrl = this.getResolvedUrl(route);
        let breadcrumb = this.breadcrumbs.find(breadcrumb => breadcrumb.url === resolvedUrl);
        if (!breadcrumb) return;

		// update existing breadcrumb
        breadcrumb.name = name;
        this.onBreadcrumbChanged.emit(this.breadcrumbs);
    }

	// get resolved url from activated route snapshot
    private getResolvedUrl(route: ActivatedRouteSnapshot): string {
		let resolvedUrl = route.pathFromRoot
			.map(value => this.getBreadcrumbUrl(value))
			.filter(value => value)
			.join('/');
		return `/${resolvedUrl}`;
    }

	// get breadcrumb url
    private getBreadcrumbUrl(route: ActivatedRouteSnapshot) {
        return route.url.map(segment => segment.toString()).join('/');
    }
}

export class Breadcrumb {
    name: string; // breadcrumb name
    end: boolean; // whether this is the end path
    url: string; // breadcrumb url
    route: Route | null; // breadcrumb route details
}