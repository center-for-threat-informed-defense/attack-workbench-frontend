import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { AttackTypeToPlural } from 'src/app/utils/type-mappings';
import { AttackType } from 'src/app/utils/types';

@Component({
  selector: 'app-stix-list-page',
  standalone: false,
  templateUrl: './stix-list-page.component.html',
})
export class StixListPageComponent implements OnInit {
  public attackType: AttackType;
  public newObjectLink: string;
  public title: string;
  public createButtonLabel: string;
  public uneditable: boolean;

  public help: Record<AttackType, string> = {
    'asset':
      'Assets represent the devices and systems commonly found within \
            Industrial Control System environments. Each asset object includes a \
            mapping of technique relationships that represent the adversary \
            actions that may target the device based on its capability and \
            function.',
    'campaign':
      'Campaigns are a grouping of intrusion activity conducted over a \
            specific period of time with common targets and objectives; this \
            activity may or may not be linked to a specific threat actor.',
    'collection': undefined, // see CollectionListComponent
    'group':
      'Groups are sets of related intrusion activity that are tracked by a \
            common name in the security community. Overlaps between names based \
            on publicly reported associations are tracked using "Associated \
            Groups" (also known as "Aliases").',
    'matrix':
      'Matrices are an organized visualization depicting the relationships \
            between tactics, techniques, and sub-techniques. ATT&CK Workbench \
            does not support matrix visualizations at present, but you can still \
            create and edit them for visualization in other tools.',
    'mitigation':
      'Mitigations represent security concepts and classes of technologies \
            that can be used to prevent a technique or sub-technique from being \
            successfully executed.',
    'software':
      'Software is a generic term for custom or commercial code, operating \
            system utilities, open-source software, or other tools used to \
            conduct behavior modeled in ATT&CK. Some instances of software have \
            multiple names associated with the same instance due to various \
            organizations tracking the same set of software by different names. \
            The team makes a best effort to track overlaps between names based \
            on publicly reported associations, which are designated as \
            "Associated Software" on each page (also known as "Aliases").',
    'tactic':
      'Tactics represent the "why" of an ATT&CK technique or \
            sub-technique. It is the adversary\'s tactical goal: the reason for \
            performing an action. For example, an adversary may want to achieve \
            credential access.',
    'technique':
      'Techniques represent "how" an adversary achieves a tactical goal by \
            performing an action. For example, an adversary may dump credentials \
            to achieve credential access.',
    'relationship': undefined,
    'note': undefined,
    'identity': undefined,
    'marking-definition': undefined,
    'data-source':
      'Data sources represent relevant information that can be collected \
            by sensors or logs to detect adversary behaviors. Data sources \
            include data components to provide an additional layer of context \
            and identify the specific properties of a data source that are \
            relevant to detecting an ATT&CK technique or sub-technique.',
    'data-component': undefined,
  };

  public get canEdit(): boolean {
    return this.authenticationService.canEdit(this.attackType);
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.attackType = this.router.url.split('/')[1] as AttackType;
    this.newObjectLink = `/${this.attackType}/new`;
    this.title = AttackTypeToPlural[this.attackType].replace(/-/g, ' ');
    this.createButtonLabel = `create ${this.attackType.startsWith('a') ? 'an' : 'a'} ${this.attackType.replace(/-/g, ' ')}`;
    this.uneditable = this.attackType === 'marking-definition';
  }
}
