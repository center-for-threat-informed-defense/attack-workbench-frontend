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
import { MarkingDefinitionListComponent } from "./views/stix/marking-definition/marking-definition-list/marking-definition-list.component";

const stixRoutes: Routes = [{
    path: 'matrix',
    data: {
      breadcrumb: 'matrices'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list',
          title: "matrices"
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
              editable: true,
              title: "view matrix"
            },
            component: StixPageComponent
          }
        ]
      },
      {
          path: ":new",
          data: {
              breadcrumb: "new matrix"
          },
          children: [{
            path: '',
            data: {
              breadcrumb: 'view',
              editable: true,
              title: "new matrix"
            },
            component: StixPageComponent
          }]
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
          breadcrumb: 'list',
          title: "techniques"
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
              title: "view technique"
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
            title: "new technique"
          },
          component: StixPageComponent
        }]
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
          breadcrumb: 'list',
          title: "tactics"
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
              title: "view tactic"
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
            title: "new tactic"
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
          breadcrumb: 'list',
          title: "mitigations"
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
              editable: true,
              title: "view mitigation"
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
            title: "new mitigation"
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
          breadcrumb: 'list',
          title: "groups"
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
              title: "view group"
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
            title: "new group"
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
          breadcrumb: 'list',
          title: "software"
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
              title: "view software"
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
            title: "new software"
          },
          component: StixPageComponent
        }
      ]
    }
    ]
  },
  {
    path: 'data-source',
    data: {
      breadcrumb: 'data sources'
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list',
          title: "data sources"
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
              title: "view data source"
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
            title: "new data source"
          },
          component: StixPageComponent
        }
      ]
    }
    ]
  },
  {
    path: 'marking-definition',
    data: {
      breadcrumb: 'marking definitions',
      more: true
    },
    children: [{
        path: '',
        data: {
          breadcrumb: 'list',
          title: "marking definitions"
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
              title: "view marking definition"
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
            title: "new marking definition"
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
        data: {
            breadcrumb: 'collections',
            more: true
        },
        children: [{
            path: "",
            data: {
                breadcrumb: "list",
                title: "collections"
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
                    title: "import collection"
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
                    title: "add collection index"
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
                    title: "view collection"
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
                    title: "new collection"
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