import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ValidationData } from 'src/app/classes/serializable';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { WebsiteIntegrationService } from 'src/app/services/website-integration/website-integration.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ToolbarComponent implements OnInit {
  @Input() public canScroll: boolean;
  @Output() public onToggleTheme = new EventEmitter();
  @Output() public onToggleSidebar = new EventEmitter();
  @Output() public onScrollTop = new EventEmitter();

  public validationData: ValidationData = null;

  public get editing(): boolean {
    return this.editorService.editing;
  }
  public get editable(): boolean {
    return this.editorService.editable;
  }
  public get hasWorkflow(): boolean {
    return this.editorService.hasWorkflow;
  }
  public get hasRelationships(): boolean {
    return this.editorService.hasRelationships;
  }
  public get deletable(): boolean {
    return (
      this.editorService.deletable && this.authenticationService.canDelete()
    );
  }
  public get isAnImportedCollection(): boolean {
    return this.editorService.isAnImportedCollection;
  }
  public get isGroup(): boolean {
    return this.editorService.isGroup;
  }

  public get isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn;
  }

  constructor(
    private sidebarService: SidebarService,
    private editorService: EditorService,
    private authenticationService: AuthenticationService,
    public websiteIntegrationService: WebsiteIntegrationService,
    private router: Router
  ) {}

  ngOnInit() {
    // intentionally left blank
  }

  public startEditing() {
    this.editorService.startEditing();
  }

  public stopEditing() {
    this.editorService.stopEditing();
  }

  public saveEdits() {
    this.editorService.onSave.emit();
  }

  public delete() {
    this.editorService.onDelete.emit();
  }

  // emit a toggle theme event
  public emitToggleTheme() {
    this.onToggleTheme.emit();
  }
  //toggle sidebar
  public toggleSidebar() {
    this.sidebarService.opened = !this.sidebarService.opened;
  }
  // emit scroll to top event
  public emitScrollTop() {
    this.onScrollTop.emit();
  }

  public get sidebarEnabled() {
    return this.editorService.sidebarEnabled;
  }

  public openExternalUrl() {
    window.open(this.websiteIntegrationService.currentWebIntegrationStatus.url);
  }

  public createCollectionFromGroup() {
    this.router.navigateByUrl(
      `/collection/new?editing=true&groupId=${this.editorService.stixId}`
    );
  }
}
