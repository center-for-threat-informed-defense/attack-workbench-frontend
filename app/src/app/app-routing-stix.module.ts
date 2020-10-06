import { CollectionListComponent } from './views/stix/collection/collection-list/collection-list.component';
import { CollectionViewComponent } from './views/stix/collection/collection-view/collection-view.component';
import { CollectionImportComponent } from './views/stix/collection/collection-import/collection-import.component';
import { CollectionExportComponent } from './views/stix/collection/collection-export/collection-export.component';

import { GroupViewComponent } from './views/stix/group/group-view/group-view.component';
import { GroupListComponent } from './views/stix/group/group-list/group-list.component';
import { GroupEditComponent } from './views/stix/group/group-edit/group-edit.component';

import { MatrixViewComponent } from './views/stix/matrix/matrix-view/matrix-view.component';
import { MatrixEditComponent } from './views/stix/matrix/matrix-edit/matrix-edit.component';
import { MatrixListComponent } from './views/stix/matrix/matrix-list/matrix-list.component';

import { MitigationListComponent } from './views/stix/mitigation/mitigation-list/mitigation-list.component';
import { MitigationViewComponent } from './views/stix/mitigation/mitigation-view/mitigation-view.component';
import { MitigationEditComponent } from './views/stix/mitigation/mitigation-edit/mitigation-edit.component';

import { SoftwareViewComponent } from './views/stix/software/software-view/software-view.component';
import { SoftwareListComponent } from './views/stix/software/software-list/software-list.component';
import { SoftwareEditComponent } from './views/stix/software/software-edit/software-edit.component';

import { TacticViewComponent } from './views/stix/tactic/tactic-view/tactic-view.component';
import { TacticListComponent } from './views/stix/tactic/tactic-list/tactic-list.component';
import { TacticEditComponent } from './views/stix/tactic/tactic-edit/tactic-edit.component';

import { TechniqueViewComponent } from './views/stix/technique/technique-view/technique-view.component';
import { TechniqueListComponent } from './views/stix/technique/technique-list/technique-list.component';
import { TechniqueEditComponent } from './views/stix/technique/technique-edit/technique-edit.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

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
          breadcrumb: 'TODO object name'
        },
        children: [{
            path: '',
            data: {
              breadcrumb: 'view'
            },
            component: MatrixViewComponent
          },
          {
            path: 'edit',
            data: {
              breadcrumb: 'edit'
            },
            component: MatrixEditComponent
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
          breadcrumb: 'TODO object name'
        },
        children: [{
            path: '',
            data: {
              breadcrumb: 'view'
            },
            component: TechniqueViewComponent
          },
          {
            path: 'edit',
            data: {
              breadcrumb: 'edit'
            },
            component: TechniqueEditComponent
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
          breadcrumb: 'TODO object name'
        },
        children: [{
            path: '',
            data: {
              breadcrumb: 'view'
            },
            component: TacticViewComponent
          },
          {
            path: 'edit',
            data: {
              breadcrumb: 'edit'
            },
            component: TacticEditComponent
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
          breadcrumb: 'TODO object name'
        },
        children: [{
            path: '',
            data: {
              breadcrumb: 'view'
            },
            component: MitigationViewComponent
          },
          {
            path: 'edit',
            data: {
              breadcrumb: 'edit'
            },
            component: MitigationEditComponent
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
          breadcrumb: 'TODO object name'
        },
        children: [{
            path: '',
            data: {
              breadcrumb: 'view'
            },
            component: GroupViewComponent
          },
          {
            path: 'edit',
            data: {
              breadcrumb: 'edit'
            },
            component: GroupEditComponent
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
          breadcrumb: 'TODO object name'
        },
        children: [{
            path: '',
            data: {
              breadcrumb: 'view'
            },
            component: SoftwareViewComponent
          },
          {
            path: 'edit',
            data: {
              breadcrumb: 'edit'
            },
            component: SoftwareEditComponent
          }
        ]
      }
    ]
  },
  {
    path: 'collection',
    data: {
      breadcrumb: 'collections'
    },
    children: [{
        path: "",
        data: {
          breadcrumb: "list"
        },
        component: CollectionListComponent
      },
      {
        path: "import",
        data: {
          breadcrumb: "import"
        },
        component: CollectionImportComponent
      },
      {
        path: "new",
        data: {
          breadcrumb: "new collection"
        },
        component: CollectionExportComponent
      },
      {
        path: ":id",
        data: {
          breadcrumb: "TODO collection name"
        },
        children: [{
            path: "",
            data: {
              breadcrumb: "view"
            },
            component: CollectionViewComponent
          },
          {
            path: "update",
            data: {
              breadcrumb: "update"
            },
            component: CollectionImportComponent
          },
          {
            path: "export",
            data: {
              breadcrumb: "export"
            },
            component: CollectionExportComponent
          }
        ]
      }
    ]
  }
]


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




// {
//     path: "collection",
//     data: {
//         breadcrumb: "collections"
//     },
//     children: [
//         {
//             path: "",
//             data: {
//                 breadcrumb: "list"
//             },
//             component: CollectionListComponent,
//         },
//         {
//             path: ":id",
//             data: {
//                 breadcrumb: "view"
//             },
//             component: CollectionViewComponent,
//             children: [
//                 {
//                     path: "import",
//                     data: {
//                         breadcrumb: "import"
//                     },
//                     component: CollectionImportComponent,
//                 }, 
//                 {
//                     path: "export",
//                     data: {
//                         breadcrumb: "export"
//                     },
//                     component: CollectionExportComponent,
//                 },
//             ]
//         },
//         {
//             path: "new",
//             data: {
//                 breadcrumb: "new collection"
//             },
//             component: CollectionExportComponent
//         }
//     ]
// }