import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';

@Component({
    selector: 'app-user-accounts-page',
    templateUrl: './user-accounts-page.component.html',
    styleUrls: ['./user-accounts-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserAccountsPageComponent implements OnInit {
    public userAccounts$: Observable<Paginated<UserAccount>>;
    public columnsToDisplay: string[];
    public searchQuery = '';
    public filterOptions: Role;
    public filter: string[] = [];

    constructor(private restAPIConnector: RestApiConnectorService) {
      this.columnsToDisplay = ['username', 'email', 'status', 'role'];
    }

    ngOnInit(): void {
        this.userAccounts$ = this.restAPIConnector.getAllUserAccounts();
    }

    public saveUser(user: UserAccount): void {
        user.save(this.restAPIConnector);
    }
}
