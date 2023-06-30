import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { FileInputComponent } from 'ngx-material-file-input';
import { Campaign } from 'src/app/classes/stix/campaign';
import { Collection, CollectionDiffCategories } from 'src/app/classes/stix/collection';
import { DataComponent } from 'src/app/classes/stix/data-component';
import { DataSource } from 'src/app/classes/stix/data-source';
import { Group } from 'src/app/classes/stix/group';
import { Matrix } from 'src/app/classes/stix/matrix';
import { Mitigation } from 'src/app/classes/stix/mitigation';
import { Relationship } from 'src/app/classes/stix/relationship';
import { Software } from 'src/app/classes/stix/software';
import { Tactic } from 'src/app/classes/stix/tactic';
import { Technique } from 'src/app/classes/stix/technique';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { RestApiConnectorService } from 'src/app/services/connectors/rest-api/rest-api-connector.service';
import { AuthenticationService } from 'src/app/services/connectors/authentication/authentication.service';
import { UserAccount } from 'src/app/classes/authn/user-account';
import { logger } from '../../../../../util/logger';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'xlsx';
import _ from 'lodash';

@Component({
	selector: 'app-collection-import',
	templateUrl: './collection-import.component.html',
	styleUrls: ['./collection-import.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CollectionImportComponent implements OnInit {
	@ViewChild(MatStepper) public stepper: MatStepper;
	@ViewChild(FileInputComponent) public fileInput: FileInputComponent;

	public url: string = '';
	public loadingStep1: boolean = false;
	public loadingStep2: boolean = false;
	public select: SelectionModel<string>;
	// ids of objects which have changed (object-version not already in knowledge base)
	public changed_ids: string[] = [];
	// ids of objects which have not changed (object-version not already in knowledge base)
	public unchanged_ids: string[] = [];
	public errorObjects: any[] = []; // list of objects that did not have enough required fields to be imported
	public import_errors: any;
	public save_errors: string[] = [];
	public successfully_saved: Set<string> = new Set();
	public collectionBundle: any;

	public get user(): UserAccount {
		return this.authenticationService.currentUser;
	}

	public object_import_categories = {
		technique:		new CollectionDiffCategories<Technique>(),
		tactic:			new CollectionDiffCategories<Tactic>(),
		campaign:		new CollectionDiffCategories<Campaign>(),
		software:		new CollectionDiffCategories<Software>(),
		relationship:	new CollectionDiffCategories<Relationship>(),
		mitigation:		new CollectionDiffCategories<Mitigation>(),
		matrix:			new CollectionDiffCategories<Matrix>(),
		group:			new CollectionDiffCategories<Group>(),
		data_source:	new CollectionDiffCategories<DataSource>(),
		data_component:	new CollectionDiffCategories<DataComponent>(),
	};

	// list of headers that comes from mitre-generated excel files and the mapping to support collection objects
	public replacementList = [
		['ID', 'attack_id'],
		['STIX ID', 'id'],
		['descriptions', 'description'],
		['platforms', 'x_mitre_platforms'],
		['version', 'x_mitre_version'],
		['domain', 'x_mitre_domains'],
		['data sources', 'x_mitre_data_sources'],
		['is sub-technique', 'x_mitre_is_subtechnique'],
		['last modified', 'modified'],
		['first seen', 'first_seen'],
		['last seen', 'last_seen'],
		['first seen citation', 'x_mitre_first_seen_citation'],
		['last seen citation', 'x_mitre_last_seen_citation'],
		['target ref', 'target_ref'],
		['source ref', 'source_ref'],
		['source name', 'source_name'],
		['target name', 'target_name'],
		['source ID', 'source_id'],
		['target ID', 'target_id'],
		['mapping description', 'description'],
		['mapping type', 'relationship_type'],
	];

	constructor(public route: ActivatedRoute,
		public http: HttpClient,
		public snackbar: MatSnackBar,
		public restAPIConnectorService: RestApiConnectorService,
		private dialog: MatDialog,
		private authenticationService: AuthenticationService
	) {
		// intentionally left blank
	}

	ngOnInit(): void {
		if (this.route.snapshot.queryParams['url']) {
			// get URL
			this.url = decodeURIComponent(this.route.snapshot.queryParams['url']);
			this.getCollectionFromURL();
		}
	}

	/**
	 * Load collection from file input
	 * @param event file input event
	 */
	public getCollectionFromFile(event: any) {
		const filename = event.target.files[0].name.split('.')[0];
		this.loadingStep1 = true;
		const target: DataTransfer = <DataTransfer>event.target;
		const reader = new FileReader();
		reader.readAsBinaryString(target.files[0]);
		reader.onload = (e: any) => {
			let str = String(e.target.result);
			let collectionBundle;
			try {
				if (event.target.files[0].type === "application/json") {
					// parse JSON file input
					collectionBundle = JSON.parse(str);
				}
				else {
					// parse .csv/.xlsx file input
					const bstr: string = e.target.result;
					const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
					collectionBundle = this.buildXlsxRequest(wb, filename);
				}
			} catch (exception) {
				this.snackbar.open(exception.message, 'dismiss', {
					duration: 2000,
					panelClass: 'warn',
				});
				this.loadingStep1 = false;
			}
			this.previewCollection(collectionBundle);
		};
	}

	/**
	 * Helper function to parse csv and excel files into collections
	 * @param wb Workbook or csv to be parsed
	 * @param filename input file name
	 * @returns a collection to be uploaded to workbench
	 */
	public buildXlsxRequest(wb: XLSX.WorkBook, filename: string): any {
		let collection = [
			{
				name: filename,
				type: 'x-mitre-collection',
				id: 'x-mitre-collection--' + uuid(),
				x_mitre_deprecated: false,
				x_mitre_version: '0.1',
				created: new Date().toISOString(),
				revoked: false,
				object_marking_refs: [],
				x_mitre_domains: ['enterprise-attack'],
				spec_version: '2.1',
				x_mitre_attack_spec_version: '3.1.0',
				created_by_ref: this.user.id,
				x_mitre_modified_by_ref: this.user.id,
				modified: new Date().toISOString(),
				description: '',
				x_mitre_contents: [],
			},
		];

		const objArray = [];

		for (let sheetname of wb.SheetNames) {
			let data: Array<string[]> = XLSX.utils.sheet_to_json(
				wb.Sheets[sheetname],
				{ header: 1 }
			);
			let headerRow: string[] = data.splice(0, 1)[0];
			// change headers appropriately to transfer between excel spreadsheet and our naming convention
			this.replacementList.forEach((i) => {
				if (headerRow.includes(i[0])) {
					headerRow[headerRow.indexOf(i[0])] = i[1];
				}
			});
			headerRow.push('type', 'spec_version', 'external_references'); // add the object types to the end of each row's array
			data.forEach((row) => {
				// create an object for the row
				var i = _.zipObject(headerRow, row);
				// set any variables that require a different format
				if (!i.id) {
					// if there is not a stix id for the object, try to generate a stix id from the attack id
					this.generateId(i);
				}
				i.attack_id = (i.attack_id) ? i.attack_id : "";
				i.description = (i.description) ? i.description : "";
				i.type = (i.id) ? i.id.split('--')[0] : '';
				i.x_mitre_version = (i.x_mitre_version) ? i.x_mitre_version.toString() : "1.0";
				i.spec_version = '2.1';
				i.x_mitre_is_subtechnique = Boolean(i.x_mitre_is_subtechnique);
				i.created = i.created ? new Date(i.created).toISOString() : '';
				i.modified = i.modified ? new Date(i.modified).toISOString() : '';
				i.x_mitre_platforms = (i.x_mitre_platforms) ? i.x_mitre_platforms.split(', ') : [];
				i.x_mitre_domains = (i.x_mitre_domains) ? i.x_mitre_domains.split(', ') : [];
				i.x_mitre_data_sources = i.x_mitre_data_sources ? i.x_mitre_data_sources.split(',') : [];
				if (i.attack_id) {
					i.external_references = [{
						source_name: 'mitre-attack',
						external_id: i.attack_id,
					}];
				}
				if (i.id) {
					objArray.push(i);
					// add object names and IDs to the collection object
					collection[0].x_mitre_contents.push({
						object_ref: i.id,
						object_modified: i.modified,
					});
				} else {
					this.errorObjects.push(i);
				}
			});
		}
		// build outer json object with the object list inside
		let jsonObj = {
			type: 'bundle',
			id: 'bundle--' + uuid(),
			objects: collection.concat(objArray),
		};
		return jsonObj;
	}

	/**
	 * Download collection from URL
	 */
	public getCollectionFromURL() {
		this.loadingStep1 = true;
		let headers: HttpHeaders = new HttpHeaders({ ExcludeCredentials: 'true' });
		let subscription_getBundle = this.http
			.get(this.url, { headers: headers })
			.subscribe({
				//get the raw collection bundle from the endpoint
				next: (collectionBundle) => this.previewCollection(collectionBundle),
				error: (err) => {
					logger.error(err);
					this.snackbar.open(err.message, 'dismiss', {
						duration: 2000,
						panelClass: 'warn',
					});
					this.loadingStep1 = false;
				},
				complete: () => {
					subscription_getBundle.unsubscribe();
				}, //prevent memory leaks
			});
	}

	/**
	 * Fetch collection to preview
	 * @param collectionBundle collection to preview
	 */
	public previewCollection(collectionBundle) {
		// send the collection bundle to the backend
		let subscription_preview = this.restAPIConnectorService
			.previewCollectionBundle(collectionBundle)
			.subscribe({
				next: (preview_results) => {
					if (preview_results.error) {
						// errors occurred when fetching collection preview
						this.import_errors = preview_results.error;
					}

					if (!preview_results.preview) {
						// collection bundle cannot be imported, show errors on next step
						this.loadingStep1 = false;
						this.stepper.next();
					} else {
						// successfully fetched preview
						this.parsePreview(collectionBundle, preview_results.preview);
					}
				},
				error: (err) => {
					this.loadingStep1 = false;
				},
				complete: () => {
					subscription_preview.unsubscribe();
				},
			});
	}

	/**
	 * Parse collection bundle for preview
	 * @param collectionBundle the collection bundle
	 * @param preview fetched preview results
	 */
	public parsePreview(collectionBundle: any, preview: Collection) {
		this.collectionBundle = collectionBundle; //save for later

		//build ID to category lookup
		let idToCategory = {};

		for (let category in preview.import_categories) {
			for (let stixId of preview.import_categories[category])
				idToCategory[stixId] = category;
		}
		//build ID to name lookup
		let idToSdo = {};
		for (let object of collectionBundle.objects) {
			if ('id' in object) idToSdo[object.id] = { stix: object };
		}

		for (let object of collectionBundle.objects) {
			// look up the category for the object
			if (!(object.id in idToCategory)) {
				// does not belong to a change category
				this.unchanged_ids.push(object.id);
				continue;
			}
			// track that this object has changed
			this.changed_ids.push(object.id);
			// determine the change category
			let category = idToCategory[object.id];
			// wrap the object as if it came from the back-end
			let raw: { [key: string]: any } = { stix: object, workspace: {} };
			// parse the object & add it to the appropriate category for rendering
			switch (object.type) {
				case 'attack-pattern': //technique
					this.object_import_categories.technique[category].push(
						new Technique(raw)
					);
					break;
				case 'x-mitre-tactic': //tactic
					this.object_import_categories.tactic[category].push(new Tactic(raw));
					break;
				case 'malware': //software
				case 'tool':
					this.object_import_categories.software[category].push(
						new Software(object.type, raw)
					);
					break;
				case 'relationship': //relationship
					// build source and target objects if the source/target objects aren't being uploaded simultaneously (in case where only relationships are uploaded)
					if (object.source_ref in idToSdo) {
						raw.source_object = idToSdo[object.source_ref];
					} else {
						raw.source_object = {
							stix: {
								attackID: object.source_id ? object.source_id : '',
								created: object.created,
								description: object.description,
								id: object.source_ref,
								modified: object.modified,
								name: object.source_name,
								spec_version: object.spec_version,
								type: object.relationship_type,
								external_references: object.source_id ? [
									{
										source_name: 'mitre-attack',
										external_id: object.source_id,
									},
								] : [],
							},
						};
					}
					if (object.target_ref in idToSdo) {
						raw.target_object = idToSdo[object.target_ref];
					} else {
						raw.target_object = {
							stix: {
								attackID: object.target_id ? object.target_id : '',
								created: object.created,
								description: object.description,
								id: object.target_ref,
								modified: object.modified,
								name: object.target_name,
								spec_version: object.spec_version,
								type: object.relationship_type,
								external_references: object.target_id ? [
									{
										source_name: 'mitre-attack',
										external_id: object.target_id,
									},
								] : [],
							},
						};
					}
					let rel = new Relationship(raw);
					this.object_import_categories.relationship[category].push(rel);
					break;
				case 'course-of-action': //mitigation
					this.object_import_categories.mitigation[category].push(
						new Mitigation(raw)
					);
					break;
				case 'x-mitre-matrix': //matrix
					this.object_import_categories.matrix[category].push(new Matrix(raw));
					break;
				case 'intrusion-set': //group
					this.object_import_categories.group[category].push(new Group(raw));
					break;
				case 'x-mitre-data-source': // data source
					this.object_import_categories.data_source[category].push(
						new DataSource(raw)
					);
					break;
				case 'x-mitre-data-component': // data component
					this.object_import_categories.data_component[category].push(
						new DataComponent(raw)
					);
					break;
				case 'campaign': // campaign
					this.object_import_categories.campaign[category].push(
						new Campaign(raw)
					);
					break;
			}
		}
		// set up selection
		this.select = new SelectionModel(true, this.changed_ids);

		this.stepper.next();
	}

	/**
	 * helper function to set an id for objects that are missing their stix id column
	 * @param object stix object being imported to collection
	 */
	public generateId(object: any): void {
		// check if object is a relationship
		if (object.attack_id) {
			switch (object.attack_id.charAt(0).toLowerCase()) {
				case 't': //technique or tactic
					const subtechniqueReg = new RegExp("T\\d{4}\\.\\d{3}");
					const techniqueReg = new RegExp("T\\d{4}");
					const tacticReg = new RegExp("TA\\d{4}");

					// check if tactic match
					if (tacticReg.test(object.attack_id)) {
						object.id = 'x-mitre-tactic--' + uuid();
					}
					//check if subtechnique
					else if (subtechniqueReg.test(object.attack_id)) {
						object.id = 'attack-pattern--' + uuid();
						object.is_subtechnique = true;
					}
					else if (techniqueReg.test(object.attack_id)) {
						object.id = 'attack-pattern--' + uuid();
					}
					break;
				case 's': // software
					if (object.type) {
						object.id = object.type + '--' + uuid();
					}
					break;
				case 'g': //groups
					object.id = 'intrusion-set--' + uuid();
					break;
				case 'm': //mitigations
					object.id = 'course-of-action--' + uuid();
					break;
				case 'd': // data sources
					object.id = 'x-mitre-data-source--' + uuid();
					break;
				case 'c': // campaign
					object.id = 'campaign--' + uuid();
					break;
			}
			return;
		}
		// relationships don't have attack ids, so check for target and source fields here
		if (object.source_id || object.target_id || object.source_name || object.target_name) {
			object.id = 'relationship--' + uuid();
			object.source_id = 'course-of-action--' + uuid();
			object.target_id = 'attack-pattern--' + uuid();

			return;
		}
	}

	/**
	 * Select all objects for import
	 */
	public selectAll() {
		for (let id of this.changed_ids) this.select.select(id);
	}

	/**
	 * deselect all objects for import
	 */
	public deselectAll() {
		this.select.clear();
	}

	/**
	 * Perform the import of the collection
	 */
	public import() {
		let prompt = this.dialog.open(ConfirmationDialogComponent, {
			maxWidth: '25em',
			data: {
				message: `Are you sure you want to import ${this.select.selected.length} objects?`,
				yes_suffix: 'import the collection',
			},
		});
		let promptSubscription = prompt.afterClosed().subscribe({
			next: (result) => {
				if (result) {
					// filter bundle for objects that were not selected
					this.loadingStep2 = true;
					setTimeout(() => {
						//make sure the loading icon renders before the parsing/writing
						let newBundle = JSON.parse(JSON.stringify(this.collectionBundle)); //deep copy
						let objects = [];
						// filter objects to selected or unchanged
						for (let object of newBundle.objects) {
							if (
								this.unchanged_ids.includes(object.id) ||
								this.select.selected.includes(object.id)
							) {
								// object is selected or unchanged
								objects.push(object);
							}
						}
						newBundle.objects = objects;
						let force = this.import_errors ? true : false; // force import if the collection bundle has errors
						let subscription = this.restAPIConnectorService
							.postCollectionBundle(newBundle, false, force)
							.subscribe({
								next: (results) => {
									if (results.import_categories.errors.length > 0) {
										logger.warn(
											'Collection import completed with errors:',
											results.import_categories.errors
										);
									}
									this.save_errors = results.import_categories.errors;
									let save_error_ids = new Set(
										this.save_errors.map((err) => err['object_ref'])
									);
									for (let category in results.import_categories) {
										if (category == 'errors') continue;
										for (let id of results.import_categories[category])
											if (!save_error_ids.has(id))
												this.successfully_saved.add(id);
									}
									logger.log(
										'Successfully imported the following objects:',
										Array.from(this.successfully_saved)
									);
									this.stepper.next();
								},
								complete: () => {
									subscription.unsubscribe();
								}, //prevent memory leaks
							});
					});
				}
			},
			complete: () => {
				promptSubscription.unsubscribe();
			}, //prevent memory leaks
		});
	}

	/**
	 * Cancel the collection import and revert to previous step
	 */
	public cancelImport(): void {
		this.import_errors = undefined;
		this.stepper.reset();
		this.loadingStep1 = false;
		this.loadingStep2 = false;
	}

	/**
	 * Download a log of errors from the import
	 */
	public downloadErrorLog() {
		this.restAPIConnectorService.triggerBrowserDownload(
			this.save_errors,
			'import-errors.json'
		);
	}
}
