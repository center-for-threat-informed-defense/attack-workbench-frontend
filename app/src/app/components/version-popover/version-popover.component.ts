import { Component, Input, OnInit } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({
    selector: 'app-version-popover',
    templateUrl: './version-popover.component.html',
    styleUrls: ['./version-popover.component.scss']
})
export class VersionPopoverComponent implements OnInit {
    @Input() public config: VersionPopoverConfig;

    public markdownContent: string = '';

    // General guidelines applicable to all objects
    private generalGuidelines: string = `
### **General Versioning Guidelines**
#### **Goals**:
- ATT&CK moves to incremental updates.
- Users can track when an item has changed between releases.
- Users have a reliable indication of the degree of change to an item.
- Published items remain stable references.

#### **Incrementing Version Numbers**:
- Version increments only once between releases (e.g., 1.0 → 1.1, not 1.3).
- Major version increments override minor increments (e.g., 1.1 → 2.0, not 2.1).
- New objects always start at version 1.0.
- Minor typos (e.g., grammar fixes) do not increment versions.

#### **Deprecation**:
- Items can be deprecated but not deleted.
- Deprecated items include a note with a link to the relevant item.
- Deprecated is a final state and is indicated on generated web pages and STIX content.
    `;

    // Specific guidelines for each object type
    private versionGuidelinesMap: { [key: string]: string } = {
        matrix: `
### **Matrix Versioning**
- Each matrix is assigned a "Last Modified" timestamp.
- Timestamps are calculated based on the content of the matrix:
  - **Techniques**: Date of addition, rename, removal, deprecation, or new platform added.
  - **Tactics**: Date of addition, rename, removal, or deprecation.
- The ATT&CK Navigator does not convey version information.
        `,
        technique: `
### **Technique Versioning**
- **Version Format**: MAJOR.MINOR
- **Major Version Changes**:
    - Name change (infrequent).
    - Scope changes, including tactic or description modifications.
- **Minor Version Changes**:
    - Descriptive information updates that don't affect scope.
    - Metadata changes (e.g., platform, permissions, data source).
- Web pages display version, created date, and last modified date.
        `,
        group: `
### **Group Versioning**
- **Version Format**: MAJOR.MINOR
- **Major Version Changes**:
    - Alias changes or additions.
    - Description changes (infrequent).
- **Minor Version Changes**:
    - References or relationships to new techniques or software.
- Web pages display version, created date, and last modified date.
        `,
        software: `
### **Software Versioning**
- **Version Format**: MAJOR.MINOR
- **Major Version Changes**:
    - Alias changes or additions.
    - Description changes (infrequent).
- **Minor Version Changes**:
    - Metadata changes.
    - References or relationships to new techniques or groups.
- Web pages display version, created date, and last modified date.
        `,
        mitigation: `
### **Mitigation Versioning**
- **Version Format**: MAJOR.MINOR
- **Major Version Changes**:
    - Name changes (infrequent).
    - Scope changes in the description.
- **Minor Version Changes**:
    - Descriptive information updates that don’t change scope.
        `
    };

    constructor() {
        // intentionally left blank
    }

    ngOnInit(): void {
        const attackType = this.config?.object && !Array.isArray(this.config.object) 
            ? this.config.object.attackType 
            : undefined;

        // Retrieve specific guidelines for the attack type or default to general guidelines
        this.markdownContent = this.versionGuidelinesMap[attackType] || this.generalGuidelines;
    }
}

export interface VersionPopoverConfig {
    /* The object of which to show the field */
    object: StixObject | [StixObject, StixObject];
}