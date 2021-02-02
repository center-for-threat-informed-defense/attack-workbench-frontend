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

const stixRoutes: Routes = [{
    path: 'matrix',
    data: {
      breadcrumb: 'matrices'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list'
        },
        component: MatrixListComponent
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
              editable: true
            },
            component: StixPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'technique',
    data: {
      breadcrumb: 'techniques'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list'
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
              editable: true
            },
            component: StixPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'tactic',
    data: {
      breadcrumb: 'tactics'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list'
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
              editable: true
            },
            component: StixPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'mitigation',
    data: {
      breadcrumb: 'mitigations'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list'
        },
        component: MitigationListComponent
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
              editable: true
            },
            component: StixPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'group',
    data: {
      breadcrumb: 'groups'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list'
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
              editable: true
            },
            component: StixPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'software',
    data: {
      breadcrumb: 'software'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list'
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
              editable: true
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
        data: {
            breadcrumb: 'collections'
        },
        children: [{
            path: "",
            data: {
                breadcrumb: "list"
            },
            component: CollectionManagerComponent,
        }, {
            path: "import-collection",
            data: {
                breadcrumb: "import a collection"
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'import'
                },
                component: CollectionImportComponent
            }]
        }, {
            path: "import-collection-index",
            data: {
                breadcrumb: "add a collection index"
            },
            children: [{
                path: '',
                data: {
                    breadcrumb: 'import'
                },
                component: CollectionIndexImportComponent
            }]
        }, {
            path: ":id",
            data: {
                breadcrumb: "loading..."
            },
            children: [{
                path: "",
                data: {
                    breadcrumb: "view",
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
export class AppRoutingStixModule {};
export { stixRoutes };