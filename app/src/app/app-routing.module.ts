import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { HelpPageComponent } from './views/help-page/help-page.component';
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { OrgIdentityPageComponent } from './views/admin-page/org-identity-page/org-identity-page.component';


//see also https://www.npmjs.com/package/angular-crumbs
const routes: Routes = [
    {
        "path": "",
        "data": {
            "breadcrumb": "home"
        },
        "children": [
            {
                "path": "",
                "data": {
                    "breadcrumb": "welcome"
                },
                "component": LandingPageComponent,
            },
            {
                "path": "admin",
                "data": {
                    "breadcrumb": "admin settings",
                    "title": "Admin Settings"
                },
                "children": [
                    {
                        "path": "",
                        "data": {
                            "breadcrumb": "admin settings",
                            "title": "Admin Settings"
                        },
                        "component": AdminPageComponent,
                    },
                    {
                        "path": "org-identity",
                        "data": {
                            "breadcrumb": "organization identity",
                            "title": "Organization Identity"
                        },
                        "component": OrgIdentityPageComponent,
                    }
                    
                ]
            },
            {
                "path": "docs",
                "data": {
                    "breadcrumb": "documentation",
                    "title": "Documentation"
                },
                "children": [
                    {
                        "path": "",
                        "data": {
                            "breadcrumb": "documentation",
                            "markdown": "/assets/docs/README.md",
                            "title": "Documentation"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "usage",
                        "data": {
                            "breadcrumb": "usage",
                            "markdown": "/assets/docs/usage.md",
                            "title": "Usage"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "collections",
                        "data": {
                            "breadcrumb": "collections",
                            "markdown": "/assets/docs/collections.md",
                            "title": "About Collections"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "changelog",
                        "data": {
                            "breadcrumb": "changelog",
                            "markdown": "/assets/docs/changelog.md",
                            "title": "Changelog"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "integrations",
                        "data": {
                            "breadcrumb": "integrations",
                            "markdown": "/assets/docs/integrations.md",
                            "title": "Integrations"
                        },
                        "component": HelpPageComponent,
                    },
                ]
            },
        ]
    },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
