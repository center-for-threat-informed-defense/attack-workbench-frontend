import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { Paginated, RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/components/add-dialog/add-dialog.component';

@Component({
  selector: 'app-teams-view-page',
  templateUrl: './teams-view-page.component.html',
  styleUrls: ['./teams-view-page.component.scss']
})
export class TeamsViewPageComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public columnsToDisplay: string[];
  public editing: boolean;
  public team = null;
  public users: Array<UserAccount>;
  public totalObjectCount: number;
  private subscriptions: Array<Subscription> = [];
  private teamId = '';
  private users$: Observable<Paginated<UserAccount>>;
  private userSubscription: Subscription;

  constructor(private restAPIConnector: RestApiConnectorService, private route: ActivatedRoute, private editorService: EditorService, private router:Router, private dialog: MatDialog) { 
    this.columnsToDisplay = ['username', 'email', 'options'];
  }

  ngOnInit(): void {
    // Basically recreating the STIX object code but dumbing it down
    this.subscriptions.push(this.route.params.subscribe((params)=>{
      this.teamId = params.id;
    }));
    this.subscriptions.push(this.route.queryParams.subscribe((queryParams)=>{
      this.editing = !!queryParams.editing ? queryParams.editing : false;
    }));
    this.subscriptions.push(this.editorService.onSave.subscribe(()=>{
      this.restAPIConnector.putTeam(this.team);
      this.router.navigate([]);
    }));
    this.subscriptions.push(this.editorService.onDelete.subscribe(()=>{
      this.restAPIConnector.deleteTeam(this.team);
      this.router.navigate([this.route.parent.url], {});
    }));
    this.subscriptions.push(this.editorService.onEditingStopped.subscribe(()=>{
      this.reload();
    }));
    this.reload();
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  public reload(): void {
    this.team = this.restAPIConnector.getTeam(this.teamId);
    this.loadUsers();
  }

  public loadUsers():void {
    let limit = this.paginator ? this.paginator.pageSize : 10;
    let offset = this.paginator ? this.paginator.pageIndex * limit : 0;
    this.users$ = this.restAPIConnector.getUserAccountsByTeamId(this.teamId,{limit, offset});
    this.userSubscription = this.users$.subscribe({
      next: (res) => {
          this.users = res.data.filter((user)=>this.team.users.includes(user.id));
          this.totalObjectCount = res.pagination.total;
      },
      complete: () => {
          this.userSubscription.unsubscribe();
      }
    })
  }

  public removeUser(element): void {
    this.team.users = this.team.users.filter((user)=>user!==element.id);
    this.restAPIConnector.putTeam(this.team);
    this.reload();
  }

  public updateUsers(): void {
    let prompt = this.dialog.open(AddDialogComponent, {
      maxWidth: "40em",
      minWidth: "40em",
      disableClose: true,
      autoFocus: false, // disables auto focus on the dialog form field
      data: {
        selectableObjects: this.users,
        type: 'users',
        select: 'something',
        selectionType: 'many',
        title: `Select users you wish to be in this team`,
        buttonLabel: "OK"
      },
    });
    let subscription = prompt.afterClosed().subscribe({
        next: (response) => {
            console.log(response);
        },
        complete: () => { subscription.unsubscribe(); } //prevent memory leaks
    });
  }
}
