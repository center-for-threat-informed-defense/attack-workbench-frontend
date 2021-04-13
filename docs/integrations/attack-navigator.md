# Integrating the ATT&CK Navigator
The [ATT&CK Navigator](https://github.com/mitre-attack/attack-navigator) can be configured to display the contents of your local knowledge base. 

To integrate the navigator, first stand up a custom instance of the application within your organization. Then edit the config file `nav-app/src/assets/config.json` by prepending a new object to the versions array connecting to the ATT&CK Workbench REST API.

```json
{
    "versions": [
        {
            "name": "ATT&CK Workbench Data", 
            "domains": [
                {   
                    "name": "Enterprise", 
                    "data": ["http://localhost:3000/api/stix-bundles/?domain=enterprise-attack"]
                },
                {   
                    "name": "Mobile", 
                    "data": ["http://localhost:3000/api/stix-bundles/?domain=mobile-attack"]
                },
                {
                    "name": "ICS",
                    "data": ["http://localhost:3000/api/stix-bundles/?domain=ics-attack"]
                }
            ]
        }
    ]
}
```

