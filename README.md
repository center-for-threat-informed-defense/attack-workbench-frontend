# ATT&CK Workbench Frontend

ATT&CK Workbench is a tool designed to containerize the MITRE ATT&CK&reg; knowledge base, making ATT&CK easier to use and extend throughout the community. Our goal is to enable users of ATT&CK to easily instantiate their own copy of the ATT&CK knowledge base and provide the tools, infrastructure, and documentation to allow those organizations to both extend ATT&CK for their own needs and easily contribute to the ATT&CK knowledge base when appropriate.

The ATT&CK Workbench application is made up of several repositories:
- ATT&CK Workbench Frontend: the front-end UI for the ATT&CK Workbench tool.
- [ATT&CK Workbench Collection Manager](https://github.com/center-for-threat-informed-defense/attack-workbench-collection-manager): REST API and CLI for managing collections.
- [ATT&CK Workbench REST API](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api): REST API service for storing, querying and editing ATT&CK objects.

For more documentation, please see the `docs` folder. The docs folder is also available in the in-app help page.
- [usage](/docs/usage.md): documentation about how to use the ATT&CK Workbench application.
- [changelog](/docs/changelog.md): documentation about updates to this application.
- [collections](/docs/collections.md): documentation about the collection data type.

## Requirements
- [Node.js](https://nodejs.org/) version `14.16.1` or greater

## Install and run

### Installing using Docker
Please refer to our [Docker install instructions](docs/docker-compose.md) for information on installing and deploying the app using Docker.

### Installing dependencies
This step is necessary for cases where the app is deployed locally through `ng serve` or `ng build`. It can be skipped for installs using docker (above).

1. Navigate to `app`
2. Run `npm install` to install required packages

### Serve on local machine
1. Run `ng serve` within the `app` directory
2. Navigate to `localhost:4200` in your browser

### Compile for use elsewhere
1. Run `ng build` within the `app` directory
2. Copy files from the `app/dist` directory

If you're building the app for production, use `ng build --prod` which will use the production environment instead of the development environment. See [Modifying the environment](#modifying-the-environment) for more information.

### Modifying the environment
The ATT&CK Workbench Frontend is configured to connect to the Collection Manager and REST API running under their default configurations. If those applications are configured to run on different ports, or if the application is to be hosted for access on multiple machines, the environment must be edited to reflect their URLs and ports.

These environment properties can be edited under `src/environments`:
- `src/environments/environment.ts` is the development environment with configurations for when it is hosted on a local machine or is being actively developed. This is the default environment file used when building the application.
- `src/environments/environment.prod.ts` is the production environment for deployment inside of an organization or in cases where the user is not developing the application. When the application is built for production deployments (`ng build --prod`) this environment file is used.

## Notice 

Copyright 2020-2021 MITRE Engenuity. Approved for public release. Document number CT0020

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at 

http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 

This project makes use of ATT&CK®

[ATT&CK Terms of Use](https://attack.mitre.org/resources/terms-of-use/)
