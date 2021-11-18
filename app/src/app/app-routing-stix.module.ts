import { CollectionManagerComponent } from "./views/stix/collection/collection-manager/collection-manager.component"; 

import { GroupListComponent } from './views/stix/group/group-list/group-list.component';
import { MatrixListComponent } from './views/stix/matrix/matrix-list/matrix-list.component';
import { MitigationListComponent } from './views/stix/mitigation/mitigation-list/mitigation-list.component';
import { SoftwareListComponent } from './views/stix/software/software-list/software-list.component';
import { TacticListComponent } from './views/stix/tactic/tactic-list/tactic-list.component';
import { TechniqueListComponent } from './views/stix/technique/technique-list/technique-list.component';

import { StixPageComponent } from "./views/stix/stix-page/stix-page.component"
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { environment } from "../environments/environment"
import { CollectionImportComponent } from "./views/stix/collection/collection-import/collection-import-workflow/collection-import.component";
import { CollectionIndexImportComponent } from "./views/stix/collection/collection-index/collection-index-import/collection-index-import.component";
import { DataSourceListComponent } from "./views/stix/data-source/data-source-list/data-source-list.component";
import { AuthorizationGuard } from "./services/helpers/authorization.guard";
import { Role } from "./classes/authn/role";

const stixRoutes: Routes = [{
    path: 'matrix',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'matrices'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "matrices",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: MatrixListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...',
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view matrix",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new matrix",
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new matrix",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }]
    }
    ]
},
{
    path: 'technique',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'techniques'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "techniques",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: TechniqueListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...'
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view technique",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new technique"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new technique",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }]
    }
    ]
},
{
    path: 'tactic',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'tactics'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "tactics",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: TacticListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...'
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view tactic",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new tactic"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new tactic",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    }
    ]
},
{
    path: 'mitigation',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'mitigations'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "mitigations",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: MitigationListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...',
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view mitigation",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new mitigation"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new mitigation",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    }
    ]
},
{
    path: 'group',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'groups'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "groups",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: GroupListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...'
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view group",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new group"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new group",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    }
    ]
},
{
    path: 'software',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'software'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "software",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: SoftwareListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...'
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view software",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new software"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new software",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    }
    ]
},
{
    path: 'data-source',
    canActivateChild: [AuthorizationGuard],
    data: {
        breadcrumb: 'data sources'
    },
    children: [{
        path: '',
        data: {
            breadcrumb: 'list',
            title: "data sources",
            roles: [Role.Visitor, Role.Editor, Role.Admin]
        },
        component: DataSourceListComponent
    },
    {
        path: ':id',
        data: {
            breadcrumb: 'loading...'
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "view data source",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new data source"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: true,
                title: "new data source",
                roles: [Role.Editor, Role.Admin]
            },
            component: StixPageComponent
        }
        ]
    }
    ]
},

]

if (environment.integrations.collection_manager.enabled) {
    stixRoutes.push({
        path: 'collection',
        canActivateChild: [AuthorizationGuard],
        data: {
            breadcrumb: 'collections'
        },
        children: [{
            path: "",
            data: {
                breadcrumb: "list",
                title: "collections",
                roles: [Role.Visitor, Role.Editor, Role.Admin]
            },
            component: CollectionManagerComponent,
        }, {
            path: "import-collection",
            data: {
                breadcrumb: "import a collection",
                title: "import collection"
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'import',
                    title: "import collection",
                    roles: [Role.Editor, Role.Admin]
                },
                component: CollectionImportComponent
            }]
        }, {
            path: "import-collection-index",
            data: {
                breadcrumb: "add a collection index",
                title: "add collection index"
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'import',
                    title: "add collection index",
                    roles: [Role.Editor, Role.Admin]
                },
                component: CollectionIndexImportComponent
            }]
        }, {
            path: ":id/modified/:modified",
            data: {
                breadcrumb: "loading..."
            },
            children: [{
                path: "",
                data: {
                    breadcrumb: "view",
                    editable: true,
                    title: "view collection",
                    roles: [Role.Visitor, Role.Editor, Role.Admin]
                },
                component: StixPageComponent
            }]
        }, {
            path: "new",
            data: {
                breadcrumb: "new collection",
                title: "new collection"
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'new collection',
                    editable: true,
                    title: "new collection",
                    roles: [Role.Editor, Role.Admin]
                },
                component: StixPageComponent
            }]
        }]
    })
}


@NgModule({
    imports: [
        RouterModule.forChild(stixRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [],
})
export class AppRoutingStixModule { };
export { stixRoutes };