import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-user-accounts-page',
    templateUrl: './user-accounts-page.component.html',
    styleUrls: ['./user-accounts-page.component.scss']
})
export class UserAccountsPageComponent implements OnInit {
    public userAccounts$: Observable<Paginated<UserAccount>>;

    constructor(private restAPIConnector: RestApiConnectorService) { }

    ngOnInit(): void {
        this.userAccounts$ = this.restAPIConnector.getAllUserAccounts();
    }

    public saveUser(user: UserAccount): void {
        user.save(this.restAPIConnector);
    }
}
