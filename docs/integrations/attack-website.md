# Integrating the ATT&CK Website
The [ATT&CK Website](https://github.com/mitre-attack/attack-website) can be configured to display the contents of your local knowledge base. 


To integrate the navigator, first stand up a custom instance of the application within your organization. Then, edit the config file, `modules/site_config.py as shown below to connect to the Workbench REST API.

```python
domains = [
    {
        "name" : "enterprise-attack",
        "location" : "http://localhost:3000/api/stix-bundles/?domain=enterprise-attack",
        "alias" : "Enterprise",
        "deprecated" : False
    },
    {
        "name" : "mobile-attack",
        "location" : "http://localhost:3000/api/stix-bundles/?domain=mobile-attack",
        "alias" : "Mobile",
        "deprecated" : False
    },
    {
        "name" : "pre-attack",
        "location" : "https://raw.githubusercontent.com/mitre/cti/master/pre-attack/pre-attack.json",
        "alias": "PRE-ATT&CK",
        "deprecated" : True
    }
]
```