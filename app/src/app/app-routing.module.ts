import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { HelpPageComponent } from './views/help-page/help-page.component';
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { OrgSettingsPageComponent } from './views/admin-page/org-settings-page/org-settings-page.component';
import { UserAccountsPageComponent } from './views/admin-page/user-accounts-page/user-accounts-page.component';
import { DefaultMarkingDefinitionsComponent } from './views/admin-page/default-marking-definitions/default-marking-definitions.component';
import { AuthorizationGuard } from './services/helpers/authorization.guard';
import { Role } from './classes/authn/role';
import { TeamsListPageComponent } from './views/admin-page/teams-list-page/teams-list-page.component';
import { TeamsViewPageComponent } from './views/admin-page/teams-view-page/teams-view-page.component';


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
                "path": "register",
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
                    "roles": [Role.ADMIN]
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
                        "path": "org-settings",
                        "data": {
                            "breadcrumb": "organization settings",
                            "title": "Organization Identity"
                        },
                        "component": OrgSettingsPageComponent,
                    },
                    {
                        "path": "user-accounts",
                        "data": {
                            "breadcrumb": "user accounts",
                            "title": "User Accounts"
                        },
                        "component": UserAccountsPageComponent,
                    },
                    {
                        "path": "default-marking-definitions",
                        "data": {
                            "breadcrumb": "default marking definitions",
                            "title": "Default Marking Definitions"
                        },
                        "component": DefaultMarkingDefinitionsComponent,
                    },
                    {
                      "path": "teams",
                      "data": {
                          "breadcrumb": "teams",
                          "title": "Teams"
                      },
                      "children": [
                        {
                            "path": "",
                            "data": {
                                "breadcrumb": "teams",
                                "title": "Teams"
                            },
                            "component": TeamsListPageComponent,
                        },
                        {
                            "path": ":id",
                            "data": {
                                "breadcrumb": "view team",
                                "title": "View Team"
                            },
                            "component": TeamsViewPageComponent,
                        },
                      ]
                    },
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
