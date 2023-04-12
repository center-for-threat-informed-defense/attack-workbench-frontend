import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUsersDialogComponent } from 'src/app/components/add-users-dialog/add-users-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-teams-view-page',
  templateUrl: './teams-view-page.component.html',
  styleUrls: ['./teams-view-page.component.scss']
})
export class TeamsViewPageComponent implements OnInit,OnDestroy {
  public editing: boolean;
  public team = null;
  private subscriptions: Array<Subscription> = [];
  private teamId = '';

  constructor(private restAPIConnector: RestApiConnectorService, private route: ActivatedRoute, private editorService: EditorService, private router:Router, private dialog: MatDialog) { 
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
      this.loadTeam();
    }));
    this.loadTeam();
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  public loadTeam(): void {
    this.team = this.restAPIConnector.getTeam(this.teamId);
  }

  public updateUsers(): void {
    let prompt = this.dialog.open(AddUsersDialogComponent, {
      maxWidth: "40em",
      minWidth: "40em",
      disableClose: true,
      autoFocus: false, // disables auto focus on the dialog form field
      data: {
        selectedUserIds: this.team.users,
        selection: new SelectionModel<string>(true),
        title: `Select users you wish to be in this team`,
        buttonLabel: "CONFIRM",
        clearSelection: false,
      },
    });
    let subscription = prompt.afterClosed().subscribe({
        next: (response) => {
            if (response!==null) {
              this.team.users = response;
              this.restAPIConnector.putTeam(this.team);
              this.loadTeam();
            }
        },
        complete: () => { subscription.unsubscribe(); } //prevent memory leaks
    });
  }
}
