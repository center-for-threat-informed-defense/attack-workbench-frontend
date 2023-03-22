import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { Role } from '../../../classes/authn/role';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '../../../services/connectors/authentication/authentication.service';
import { Status } from '../../../classes/authn/status';

@Component({
    selector: 'app-user-accounts-page',
    templateUrl: './user-accounts-page.component.html',
    styleUrls: ['./user-accounts-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserAccountsPageComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public userAccounts$: Observable<Paginated<UserAccount>>;
    public userAccounts: UserAccount[];
    public columnsToDisplay: string[];
    public filterOptions: any[];
    public totalObjectCount: number = 0;
    public userSubscription: Subscription;
    public selectedFilters: string[];
    public searchQuery: '';

    public get currentUser(): UserAccount {
        return this.authenticationService.currentUser;
    }

    public get isAdmin(): boolean {
        return this.authenticationService.isAuthorized([Role.ADMIN]);
    }

    constructor(private restAPIConnector: RestApiConnectorService, private authenticationService: AuthenticationService) {
        this.columnsToDisplay = ['username', 'email', 'status', 'role'];
        this.filterOptions = [
            {
                name: 'Status',
                values: Object.values(Status as {})
            },
            {
                name: 'Role',
                values: Object.values(Role as {})
            }
        ];
    }

    ngOnInit(): void {
        this.getAccounts({limit: 10, offset: 0});
    }

    public getAccounts(options: { limit: number, offset: number, status?: string[], role?: string[], search?: string }) {
        this.userAccounts$ = this.restAPIConnector.getAllUserAccounts(options);
        this.userSubscription = this.userAccounts$.subscribe({
            next: (data) => {
                this.userAccounts = data.data;
                this.totalObjectCount = data.pagination.total;
            },
            complete: () => {
                this.userSubscription.unsubscribe()
            }
        });
    }

    public applyFilters(filters, applyControls = false): void {
        let roleFilters = [];
        let statusFilters = [];
        let limit = this.paginator ? this.paginator.pageSize : 10;
        let offset = this.paginator || applyControls ? this.paginator.pageIndex * limit : 0;
        if (!applyControls && this.paginator) this.paginator.pageIndex = 0;
        this.selectedFilters = filters;
        filters.forEach((filter) => {
            if (this.filterOptions[0].values.includes(filter)) { // Status
                statusFilters.push(filter)
            } else if (this.filterOptions[1].values.includes(filter)) { // Role
                roleFilters.push(filter)
            }
        })
        this.getAccounts({limit: limit, offset: offset, status: statusFilters, role: roleFilters});
    }

    public applySearch(query, applyControls = false): void {
        let limit = this.paginator ? this.paginator.pageSize : 10;
        let offset = this.paginator || applyControls ? this.paginator.pageIndex * limit : 0;
        if (!applyControls && this.paginator) this.paginator.pageIndex = 0;
        this.getAccounts({limit: limit, offset: offset, search: query});
    }

    public applyControls(): void {
        if (this.searchQuery) this.applySearch(this.searchQuery, true);
        if (this.selectedFilters) this.applyFilters(this.selectedFilters, true);
        if (!this.searchQuery && !this.selectedFilters) {
            let limit = this.paginator ? this.paginator.pageSize : 10;
            let offset = this.paginator ? this.paginator.pageIndex * limit : 0;
            this.getAccounts({limit: limit, offset: offset});
        }
    }

    public updateUserRole(userAccount: UserAccount, newRole: string): void {
        newRole = newRole.toUpperCase();
        if (Role[newRole]) {
            let user = new UserAccount(userAccount);
            user.role = Role[newRole];

            // update user status based on active roles
            user.status = this.authenticationService.activeRoles.includes(user.role) ? Status.ACTIVE : Status.INACTIVE;

            const subscription = user.save(this.restAPIConnector).subscribe({
                complete: () => {
                    this.applyControls(); // refresh list
                    subscription.unsubscribe();
                }
            });
        }
    }

    public updateUserStatus(userAccount: UserAccount, newStatus: string): void {
        newStatus = newStatus.toUpperCase();
        if (Status[newStatus]) {
            let user = new UserAccount(userAccount);
            user.status = Status[newStatus];

            // update user role based on status
            if ([Status.INACTIVE, Status.PENDING].includes(user.status)) user.role = Role.NONE;

            const subscription = user.save(this.restAPIConnector).subscribe({
                complete: () => {
                    this.applyControls(); // refresh list
                    subscription.unsubscribe();
                }
            });
        }
    }
}
