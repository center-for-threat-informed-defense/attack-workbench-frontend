import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbService } from 'src/app/services/helpers/breadcrumb.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
	public breadcrumbs: Breadcrumb[];

	constructor(private breadcrumbService: BreadcrumbService) {
		breadcrumbService.onBreadcrumbChanged.subscribe((crumbs: Breadcrumb[]) => {
			this.breadcrumbs = crumbs;
		});
	}
}
