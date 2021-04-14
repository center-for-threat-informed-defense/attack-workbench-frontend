import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { stixRoutes } from "../../app-routing-stix.module";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {
    
    public routes: any[] = [];
    constructor(private restApiConnector: RestApiConnectorService, private dialog: MatDialog, private router: Router) {
        this.routes = stixRoutes;
    }

    ngOnInit() {
        // bug the user about editing their organization identity
        let subscription = this.restApiConnector.getOrganizationIdentity().subscribe({
            next: (identity) => {
                if (identity.name == "Placeholder Organization Identity") {
                    let prompt = this.dialog.open(ConfirmationDialogComponent, {
                        maxWidth: "35em",
                        data: { 
                            message: '### Your organization identity has not yet been set.\n\nYour organization identity is used for attribution of edits you make to objects in the knowledge base and is attached to published collections. Currently, a placeholder is being used.\n\nUpdate your organization identity now?',
                            yes_suffix: "edit my identity now",
                            no_suffix: "edit my identity later"
                        }
                    })
                    let prompt_subscription = prompt.afterClosed().subscribe({
                        next: (prompt_result) => {
                            if (prompt_result) this.router.navigate(["/admin/org-identity"]);
                        },
                        complete: () => { prompt_subscription.unsubscribe(); }
                    })
                }
            },
            complete: () => subscription.unsubscribe()
        })
    }

}
