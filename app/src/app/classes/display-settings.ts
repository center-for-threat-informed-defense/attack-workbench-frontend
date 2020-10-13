import { collectionDisplaySettings } from './stix/collection';
import { groupDisplaySettings } from './stix/group';
import { softwareDisplaySettings } from './stix/software';
import { genericDisplaySettings } from './stix/stix-object';
import { techniqueDisplaySettings } from './stix/technique';

/**
 * DisplaySettings for a given STIX object. Utility structure for describing how a given 
 * STIX object should be displayed in a table, view page, etc.
 */
export interface DisplaySettings {
    // properties for table display
    tableColumns: DisplayProperty[]; // what properties should be displayed for columns shown in a table?
    tableDetail: DisplayProperty[]; //what properties should be displayed when expanded within a table?
    // properties for main view page
    viewCard: DisplayProperty[]; //what items should be shown within a card display for this object?
    viewMain: DisplayProperty[]; //what items should be shown for the main body of the view page?
}

// allowed ways to display a property
type type_display = "plain" | "tags" | "tag" | "descriptive" | "date";
/**
 * Configuration for how to display a specific property.
 */
export interface DisplayProperty {
    property: any; //function or string, accessor for the property on the stix object
    display: type_display; // how to display the given property
}

/**
 * Get the relevant DisplaySettings object given an attack type in string format
 * @param {string} attacktype optional, the type of object, e.g "group", "software", "relationship". 
 *                            If not specified returns generic display settings appropriate for any SDO
 * @returns DisplaySettings object for the given attack type
 */
export function getDisplaySettings(attacktype?: string) {
    let displayLookup = {
        "collection": collectionDisplaySettings,
        "group": groupDisplaySettings,
        // "matrix": matrixDisplaySettings,
        // "mitigation": mitigationDisplaySgroupDisplaySettings,
        "software": softwareDisplaySettings,
        // "tactic": tacticDisplaySgroupDisplaySettings,
        "technique": techniqueDisplaySettings,
        // "relationship": relationshipDisplaySgroupDisplaySettings
    }
    if (attacktype in displayLookup) return displayLookup[attacktype];
    else return genericDisplaySettings;
}