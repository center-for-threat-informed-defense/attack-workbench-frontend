# Federated ATT&CK Frontend

Federated ATT&CK is a tool designed to containerize the MITRE ATT&CK&reg; knowledge base, making ATT&CK easier to use and extend throughout the community. Our goal is to enable users of ATT&CK to easily instantiate their own copy of the ATT&CK knowledge base and provide the tools, infrastructure, and documentation to allow those organizations to both extend ATT&CK for their own needs and easily contribute to the ATT&CK knowledge base when appropriate.

The Federated ATT&CK Editor application is made up of several repositories:
- Federated ATT&CK Frontend: the front-end UI for the Federated ATT&CK Editor.
- [Federated ATT&CK Collection Manager](https://github.com/center-for-threat-informed-defense/federated-attack-collection-manager): REST API and CLI for managing collections.
- [Federated ATT&CK REST API](https://github.com/center-for-threat-informed-defense/federated-attack-rest-api): REST API service for storing, querying and editing ATT&CK objects.

For more documentation, please see the `docs` folder. The docs folder is also available in the in-app help page.
- [usage](/docs/usage.md): documentation about how to use the Federated ATT&CK Editor application.
- [changelog](/docs/changelog.md): documentation about updates to this application.
- [collections](/docs/collections.md): documentation about the collection data type.

## Requirements
- [Node.js](https://nodejs.org/) version `10.13.0` or greater

## Install and run
1. Navigate to `app`
2. Run `npm install` to install required packages

### Serve on local machine
1. Run `ng serve` within the `app` directory
2. Navigate to `localhost:4200` in your browser

### Compile for use elsewhere
1. Run `ng build` within the `app` directory
2. Copy files from the `app/dist` directory



## Notice 

Copyright 2020 MITRE Engenuity. Approved for public release. 

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at 

http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. 

This project makes use of ATT&CK®

[ATT&CK Terms of Use](https://attack.mitre.org/resources/terms-of-use/)