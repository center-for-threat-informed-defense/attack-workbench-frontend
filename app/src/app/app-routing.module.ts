import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { HelpPageComponent } from './views/help-page/help-page.component';


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
                "path": "docs",
                "data": {
                    "breadcrumb": "documentation",
                },
                "children": [
                    {
                        "path": "",
                        "data": {
                            "breadcrumb": "documentation",
                            "markdown": "/assets/docs/README.md"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "usage",
                        "data": {
                            "breadcrumb": "usage",
                            "markdown": "/assets/docs/usage.md"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "collections",
                        "data": {
                            "breadcrumb": "collections",
                            "markdown": "/assets/docs/collections.md"
                        },
                        "component": HelpPageComponent,
                    },
                    {
                        "path": "changelog",
                        "data": {
                            "breadcrumb": "changelog",
                            "markdown": "/assets/docs/changelog.md"
                        },
                        "component": HelpPageComponent,
                    },
                ]
            },
        ]
    },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
