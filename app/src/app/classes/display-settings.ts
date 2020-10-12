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