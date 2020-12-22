export const environment = {
    production: true,
    integrations: {
        rest_api: {
            // configuration for the ATT&CK Workbench REST API
            // https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api
            enabled: true, // MUST be true for application operation
            url: "http://localhost", 
            port: "3000",
        },
        collection_manager: {
            // configuration for the ATT&CK Workbench Collection Manager
            // https://github.com/center-for-threat-informed-defense/attack-workbench-collection-manager
            enabled: true, //if false, all systems for collection management will be disabled
            url: "http://localhost",
            port: "3001"
        }
    }
};
