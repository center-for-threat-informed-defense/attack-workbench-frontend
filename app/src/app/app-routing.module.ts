import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { HelpPageComponent } from './views/help-page/help-page.component';
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { OrgIdentityPageComponent } from './views/admin-page/org-identity-page/org-identity-page.component';
import { UserAccountsPageComponent } from './views/admin-page/user-accounts-page/user-accounts-page.component';
import { Role } from './classes/authn/role';
import { AuthorizationGuard } from './guards/authorization.guard';


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
                "canActivate": [AuthorizationGuard],
                "canActivateChild": [AuthorizationGuard],
                "data": {
                    "breadcrumb": "admin settings",
                    "title": "Admin Settings",
                    "roles": [Role.Admin]
                },
                "children": [
                    {
                        "path": "",
                        "data": {
                            "breadcrumb": "admin settings",
                            "title": "Admin Settings",
                        },
                        "component": AdminPageComponent,
                    },
                    {
                        "path": "org-identity",
                        "data": {
                            "breadcrumb": "organization identity",
                            "title": "Organization Identity",
                        },
                        "component": OrgIdentityPageComponent,
                    },
                    {
                        "path": "user-accounts",
                        "data": {
                            "breadcrumb": "user accounts",
                            "title": "User Accounts",
                        },
                        "component": UserAccountsPageComponent,
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
                    {
                        "path": "contributing",
                        "data": {
                            "breadcrumb": "contributing",
                            "markdown": "/assets/docs/contributing.md",
                            "title": "Contributing"
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
