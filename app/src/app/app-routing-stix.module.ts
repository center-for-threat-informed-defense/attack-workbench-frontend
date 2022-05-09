import { CollectionManagerComponent } from "./views/stix/collection/collection-manager/collection-manager.component";
import { CollectionImportComponent } from "./views/stix/collection/collection-import/collection-import-workflow/collection-import.component";
import { CollectionIndexImportComponent } from "./views/stix/collection/collection-index/collection-index-import/collection-index-import.component";

import { GroupListComponent } from './views/stix/group/group-list/group-list.component';
import { MatrixListComponent } from './views/stix/matrix/matrix-list/matrix-list.component';
import { MitigationListComponent } from './views/stix/mitigation/mitigation-list/mitigation-list.component';
import { SoftwareListComponent } from './views/stix/software/software-list/software-list.component';
import { TacticListComponent } from './views/stix/tactic/tactic-list/tactic-list.component';
import { TechniqueListComponent } from './views/stix/technique/technique-list/technique-list.component';
import { MarkingDefinitionListComponent } from "./views/stix/marking-definition/marking-definition-list/marking-definition-list.component";
import { DataSourceListComponent } from "./views/stix/data-source/data-source-list/data-source-list.component";

import { StixPageComponent } from "./views/stix/stix-page/stix-page.component";

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { environment } from "../environments/environment"
import { AuthorizationGuard } from "./services/helpers/authorization.guard";
import { Role } from "./classes/authn/role";
import { ReferenceManagerComponent } from "./views/reference-manager/reference-manager.component";

var viewRoles = [Role.VISITOR, Role.EDITOR, Role.ADMIN];
var editRoles = [Role.EDITOR, Role.ADMIN];

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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
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
            roles: viewRoles
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
                roles: viewRoles,
                editRoles: editRoles
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
                roles: editRoles,
                editRoles: editRoles
            },
            component: StixPageComponent
        }
        ]
    }
    ]
},
{
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
            title: "marking definitions",
            roles: viewRoles
        },
        component: MarkingDefinitionListComponent
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
                editable: false,
                title: "view marking definition",
                roles: viewRoles
            },
            component: StixPageComponent
        }
        ]
    },
    {
        path: ":new",
        data: {
            breadcrumb: "new marking definition"
        },
        children: [{
            path: '',
            data: {
                breadcrumb: 'view',
                editable: false,
                title: "new marking definition",
                roles: [Role.ADMIN]
            },
            component: StixPageComponent
        }
        ]
    }
    ]
}
]

if (environment.integrations.collection_manager.enabled) {
    stixRoutes.push({
        path: 'collection',
        canActivateChild: [AuthorizationGuard],
        data: {
            breadcrumb: 'collections',
            more: true
        },
        children: [{
            path: "",
            data: {
                breadcrumb: "list",
                title: "collections",
                roles: viewRoles
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
                    roles: [Role.ADMIN]
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
                    roles: [Role.ADMIN]
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
                    roles: viewRoles,
                    editRoles: [Role.ADMIN]
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
                    roles: [Role.ADMIN],
                    editRoles: [Role.ADMIN]
                },
                component: StixPageComponent
            }]
        }]
    })
}

stixRoutes.push(
    {
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
                title: "references",
                roles: viewRoles,
                editRoles: editRoles
            },
            component: ReferenceManagerComponent
        }
        ]
    }
)

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