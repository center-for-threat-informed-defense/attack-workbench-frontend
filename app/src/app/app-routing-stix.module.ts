import { CollectionManagerComponent } from './views/stix/collection/collection-manager/collection-manager.component';
import { CollectionImportComponent } from './views/stix/collection/collection-import/collection-import-workflow/collection-import.component';
import { CollectionIndexImportComponent } from './views/stix/collection/collection-index/collection-index-import/collection-index-import.component';
import { GroupListComponent } from './views/stix/group/group-list/group-list.component';
import { MatrixListComponent } from './views/stix/matrix/matrix-list/matrix-list.component';
import { MitigationListComponent } from './views/stix/mitigation/mitigation-list/mitigation-list.component';
import { SoftwareListComponent } from './views/stix/software/software-list/software-list.component';
import { TacticListComponent } from './views/stix/tactic/tactic-list/tactic-list.component';
import { TechniqueListComponent } from './views/stix/technique/technique-list/technique-list.component';
import { MarkingDefinitionListComponent } from './views/stix/marking-definition/marking-definition-list/marking-definition-list.component';
import { DataSourceListComponent } from './views/stix/data-source/data-source-list/data-source-list.component';
import { ReferenceManagerComponent } from './views/reference-manager/reference-manager.component';
import { CampaignListComponent } from './views/stix/campaign/campaign-list/campaign-list.component';
import { NotesPageComponent } from './views/notes-page/notes-page.component';
import { StixPageComponent } from './views/stix/stix-page/stix-page.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment'
import { AuthorizationGuard } from './services/helpers/authorization.guard';
import { Role } from './classes/authn/role';

const viewRoles = [Role.VISITOR, Role.EDITOR, Role.ADMIN];
const editRoles = [Role.EDITOR, Role.ADMIN];
const attackTypeToPlural = {
    'technique': 'techniques',
    'tactic': 'tactics',
    'group': 'groups',
    'campaign': 'campaigns',
    'software': 'software',
    'mitigation': 'mitigations',
    'matrix': 'matrices',
    'data-source': 'data-sources',
}
const stixRouteData = [
	{
		attackType: 'matrix',
		editable: true,
		component: MatrixListComponent
	},
	{
		attackType: 'tactic',
		editable: true,
		component: TacticListComponent
	},
	{
		attackType: 'technique',
		editable: true,
		component: TechniqueListComponent
	},
	{
		attackType: 'data-source',
		editable: true,
		component: DataSourceListComponent
	},
	{
		attackType: 'mitigation',
		editable: true,
		component: MitigationListComponent
	},
	{
		attackType: 'group',
		editable: true,
		component: GroupListComponent
	},
	{
		attackType: 'software',
		editable: true,
		component: SoftwareListComponent
	},
	{
		attackType: 'campaign',
		editable: true,
		component: CampaignListComponent
	},
]

const stixRoutes: Routes = [];
stixRouteData.forEach(stixRoute => {
	stixRoutes.push({
		path: stixRoute.attackType,
		canActivateChild: [AuthorizationGuard],
		data: {
			breadcrumb: attackTypeToPlural[stixRoute.attackType].replace(/-/g, ' ')
		},
		children: [{
			path: '',
			data: {
				breadcrumb: 'list',
				title: attackTypeToPlural[stixRoute.attackType].replace(/-/g, ' '),
				roles: viewRoles
			},
			component: stixRoute.component
		}, {
			path: ':id',
			data: {
				breadcrumb: 'loading...'
			},
			children: [{
				path: '',
				data: {
					breadcrumb: 'view',
					editable: stixRoute.editable,
					title: `view ${stixRoute.attackType.replace(/-/g, ' ')}`,
					roles: viewRoles,
					editRoles: editRoles
				},
				component: StixPageComponent
			}]
		}, {
			path: ':new',
			data: {
				breadcrumb: `new ${stixRoute.attackType.replace(/-/g, ' ')}`
			},
			children: [{
				path: '',
				data: {
					breadcrumb: 'view',
					editable: stixRoute.editable,
					title: `new ${stixRoute.attackType.replace(/-/g, ' ')}`,
					roles: editRoles,
					editRoles: editRoles
				},
				component: StixPageComponent
			}]
		}]
	})
});

stixRoutes.push({
	path: 'marking-definition',
	canActivateChild: [AuthorizationGuard],
	data: {
		breadcrumb: 'marking definitions',
		more: true
	},
	children: [{
		path: '',
		data: {
			breadcrumb: 'list',
			title: 'marking definitions',
			roles: viewRoles
		},
		component: MarkingDefinitionListComponent
	}, {
		path: ':id',
		data: {
			breadcrumb: 'loading...'
		},
		children: [{
			path: '',
			data: {
				breadcrumb: 'view',
				editable: false,
				title: 'view marking definition',
				roles: viewRoles
			},
			component: StixPageComponent
		}]
	}, {
		path: ':new',
		data: {
			breadcrumb: 'new marking definition'
		},
		children: [{
			path: '',
			data: {
				breadcrumb: 'view',
				editable: false,
				title: 'new marking definition',
				roles: [Role.ADMIN]
			},
			component: StixPageComponent
		}]
	}]
});

if (environment.integrations.collection_manager.enabled) {
    stixRoutes.push({
        path: 'collection',
        canActivateChild: [AuthorizationGuard],
        data: {
            breadcrumb: 'collections',
            more: true
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'list',
                title: 'collections',
                roles: viewRoles
            },
            component: CollectionManagerComponent,
        }, {
            path: 'import-collection',
            data: {
                breadcrumb: 'import a collection',
                title: 'import collection'
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'import',
                    title: 'import collection',
                    roles: [Role.ADMIN]
                },
                component: CollectionImportComponent
            }]
        }, {
            path: 'import-collection-index',
            data: {
                breadcrumb: 'add a collection index',
                title: 'add collection index'
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'import',
                    title: 'add collection index',
                    roles: [Role.ADMIN]
                },
                component: CollectionIndexImportComponent
            }]
        }, {
            path: ':id/modified/:modified',
            data: {
                breadcrumb: 'loading...'
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'view',
                    editable: true,
                    title: 'view collection',
                    roles: viewRoles,
                    editRoles: [Role.ADMIN]
                },
                component: StixPageComponent
            }]
        }, {
            path: 'new',
            data: {
                breadcrumb: 'new collection',
                title: 'new collection'
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'new collection',
                    editable: true,
                    title: 'new collection',
                    roles: [Role.ADMIN],
                    editRoles: [Role.ADMIN]
                },
                component: StixPageComponent
            }]
        }]
    })
}

stixRoutes.push({
	path: 'reference-manager',
	canActivateChild: [AuthorizationGuard],
	data: {
		breadcrumb: 'reference manager',
		more: true
	},
	children: [{
		path: '',
		data: {
			breadcrumb: 'list',
			title: 'references',
			roles: viewRoles,
			editRoles: editRoles
		},
		component: ReferenceManagerComponent
	}]
}, {
	path: 'notes',
	canActivateChild: [AuthorizationGuard],
	data: {
		breadcrumb: 'notes',
		more: true
	},
	children: [{
		path: '',
		data: {
			breadcrumb: 'list',
			title: 'Notes Search',
			roles: editRoles
		},
		component: NotesPageComponent
	}]
});

@NgModule({
    imports: [
        RouterModule.forChild(stixRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [],
})
export class AppRoutingStixModule { }
export { stixRoutes };