import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Role } from '../../../classes/authn/role';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '../../../services/connectors/authentication/authentication.service';

@Component({
    selector: 'app-user-accounts-page',
    templateUrl: './user-accounts-page.component.html',
    styleUrls: ['./user-accounts-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserAccountsPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public userAccounts$: Observable<Paginated<UserAccount>>;
    public userAccounts: Paginated<UserAccount>;
    public filteredAccounts: Paginated<UserAccount>;
    public columnsToDisplay: string[];
    public filterOptions: any[];
    public totalObjectCount = 0;
    public userSubscription: Subscription;
    public selectedFilters: string[];
    public get isAdmin(): boolean { return this.authenticationService.isAuthorized([Role.Admin]); }

    constructor(private restAPIConnector: RestApiConnectorService, private authenticationService: AuthenticationService) {
        this.columnsToDisplay = ['username', 'email', 'status', 'role'];
        this.filterOptions = [
            {
                name: 'Status',
                values: [
                    {
                        value: 'active'
                    },
                    {
                        value: 'pending',
                    }
                ]
            },
            {
                name: 'Role',
                values: [
                    {
                        value: 'admin'
                    },
                    {
                        value: 'visitor'
                    }
                ]
            }
        ];
    }

    ngOnInit(): void {
        this.userAccounts$ = this.restAPIConnector.getAllUserAccounts();
        this.userSubscription = this.userAccounts$.subscribe({
            next: (data) => {
                this.userAccounts = data;
                this.filteredAccounts = data;
                // this.totalObjectCount = data.pagination.total;
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

    public handleFilterSelection(selectedFilter): void {
        this.selectedFilters = selectedFilter.value;
        this.filteredAccounts = this.applyFilters(this.userAccounts);
    }

    public applyFilters(accounts): any {
        let filtered = accounts;
        if (this.selectedFilters) this.selectedFilters.forEach((selectedVal) => {
            let key = this.filterOptions.find((filter) => {
                return filter.values.find((val) => {
                    return val.value === selectedVal;
                });
            })?.name?.toLowerCase();
            if (key) {
                key = key.toLowerCase();
                filtered = Array(accounts).filter((account) => {
                    return account[key] === selectedVal;
                });
            }
        });
        return filtered;
    }

    public applySearch(query): void {
        this.filteredAccounts = (this.userAccounts as any).filter((acc) => {
            return Object.keys(acc).some((key) => {
                return acc[key] && acc[key].includes(query);
            });
        });
        this.filteredAccounts = this.applyFilters(this.filteredAccounts);
    }

    public applyControls(search?: string): void {
        const limit = this.paginator ? this.paginator.pageSize : 10;
        const offset = this.paginator ? this.paginator.pageIndex * limit : 0;
    }

    public updateUserRole(userAcc: UserAccount, newRole: string): void {
        newRole = newRole.charAt(0).toUpperCase() + newRole.slice(1);
        if (Role[`${newRole}`]) {
            const subscription = this.restAPIConnector.getUserAccount(userAcc.id).subscribe({
                next: (r) => {
                    const user = r;
                    user.role = Role[`${newRole}`];
                    new UserAccount(user).save(this.restAPIConnector);
                },
                complete: () => { subscription.unsubscribe(); }
            });
        }
    }

    public approveUser(userAcc: UserAccount): void {
        const subscription = this.restAPIConnector.getUserAccount(userAcc.id).subscribe({
            next: (r) => {
                const user = r;
                user.status = 'active';
                new UserAccount(user).save(this.restAPIConnector);
            },
            complete: () => { subscription.unsubscribe(); }
        });
    }
}
