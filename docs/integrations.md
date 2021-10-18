# Integrations

The ATT&CK Workbench is designed to integrate with a variety of tools. This page provides documentation on how to set up such integrations.

Many ATT&CK Workbench integrations require that specific fields or values are present on your custom STIX data to use it properly. Depending on what data you have some objects may not be shown in integrations. Objects may not show up in integrations if they:

-   Support ATT&CK IDs but do not have one assigned
-   Are revoked or deprecated
-   Support platforms or tactics but are not assigned to any
-   Support mappings to techniques but do not feature any mappings

## Workbench REST API URLs

Depending on whether you are using the manual install or the docker install, and where Workbench has been deployed, the URLs you will be setting in your integrations will be different.

The following API routes are used with integrations to access STIX bundles representing the local knowledge base:

| Domain     | API Route                                     |
| :--------- | :-------------------------------------------- |
| Enterprise | `/api/stix-bundles/?domain=enterprise-attack` |
| Mobile     | `/api/stix-bundles/?domain=mobile-attack`     |
| ICS        | `/api/stix-bundles/?domain=ics-attack`        |

The host the routes are available at depends on how the Workbench has been installed and deployed:

| Deployment Type | Installation Type | Host (hostname:port)     |
| :-------------- | :---------------- | :----------------------- |
| local           | manual            | `http://localhost:3000`  |
| local           | docker            | `http://localhost`       |
| remote          | manual            | `{remote-hostname}:3000` |
| remote          | docker            | `{remote-hostname}`      |

For example, the enterprise STIX bundle of a manual installation running locally would be available at `http://localhost:3000/api/stix-bundles/?domain=enterprise-attack`. You can test the URL by opening it in your web browser while the Workbench is running - if it is correct you should see a JSON object as a response.

## ATT&CK Navigator Integration

The [ATT&CK Navigator](https://github.com/mitre-attack/attack-navigator) can be configured to display the contents of your local knowledge base.

### 1. Install the Navigator

Clone the [ATT&CK Navigator](https://github.com/mitre-attack/attack-navigator) repository: `git clone https://github.com/mitre-attack/attack-navigator.git`

### 2. Update the config

Edit the config file `nav-app/src/assets/config.json` by prepending a new object to the versions array connecting to the ATT&CK Workbench REST API. Refer to [Workbench REST API URLs, above](#workbench-rest-api-urls), for the values for the enterprise, mobile and ICS URLs.

```json
{
    "versions": [
        {
            "name": "ATT&CK Workbench Data",
            "domains": [
                {
                    "name": "Enterprise",
                    "data": ["(Enterprise URL)"]
                },
                {
                    "name": "Mobile",
                    "data": ["(Mobile URL)"]
                },
                {
                    "name": "ICS",
                    "data": ["(ICS URL)"]
                }
            ]
        }
    ]
}
```

### 3. Serve the application

Follow the [install and run](https://github.com/mitre-attack/attack-navigator#install-and-run) instructions on the ATT&CK Navigator to deploy the application. The Navigator will update its data from the Workbench every time it loads, so there is no need to periodically rebuild the application to stay synchronized with Workbench data.

## ATT&CK Website Integration

The [ATT&CK Website](https://github.com/mitre-attack/attack-website) can be configured to display the contents of your local knowledge base.

### 1. Install the Website

Clone the [ATT&CK Website](https://github.com/mitre-attack/attack-website) repository: `git clone https://github.com/mitre-attack/attack-website.git`

### 2. Update Config

Edit the domain URLs in the config file `modules/site_config.py` as shown below to connect to the Workbench REST API. Refer to [Workbench REST API URLs, above](#workbench-rest-api-urls), for the values for the enterprise and mobile URLs.

```python
domains = [
    {
        "name" : "enterprise-attack",
        "location" : "(Enterprise URL)",
        "alias" : "Enterprise",
        "deprecated" : False
    },
    {
        "name" : "mobile-attack",
        "location" : "(Mobile URL)",
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

### 3. Build the site

Run `python3 update-attack.py` to build the website using the current Workbench data.

### 4. Serve the site

Copy the files from output to your web server or use `python3 -m http.server [port]` to host for local browsing.

If the data within the Workbench changes you will need to rebuild the site (from step 3) again; for this reason you may want to consider re-running your build and deploy pipeline at regular intervals using `cron` to keep the data synchronized with the contents of the Workbench.
