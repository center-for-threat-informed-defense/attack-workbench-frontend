// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // configuration for the ATT&CK Workbench REST API
    // https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api
    rest_api_url: "http://localhost",
    rest_api_port: "3000",
    // configuration for the ATT&CK Workbench Collection Manager
    // https://github.com/center-for-threat-informed-defense/attack-workbench-collection-manager
    collection_manager_url: "http://localhost",
    collection_manager_port: "3001"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
