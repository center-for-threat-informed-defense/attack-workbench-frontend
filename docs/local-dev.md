# Local Development Documentation

This document outlines how to set up ATT&CK Workbench for local development. For information on installing and deploying the full application using Docker, please refer to the [docker install instructions](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/master/docs/docker-compose.md).

## Prerequisites

Before running the application locally, ensure you have the following set up:

1. Clone the required repositories
    - [attack-workbench-frontend](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend) repository
    - [attack-workbench-rest-api](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api) repository alongside the frontend

2. Install the [recommended version](../README.md#requirements) of [Node.js](https://nodejs.org/)

3. Install MongoDB

    Follow the official [MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/) to install MongoDB on your operating system.


## Configure and Run the REST API

#### 1. Install dependencies
    
Navigate to the `attack-workbench-rest-api` directory and run

```
npm install
```

#### 2. Configure the system

Configure the application using environment variables, a configuration file, or a combination. Please refer to the documentation on how to [Configure the System](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api?tab=readme-ov-file#step-3-configure-the-system) for more details.

For example, you can use a custom configuration to adapt to your specific environment:

- Create a `.rest-api-env` file:

    ```bash
    export DATABASE_URL=mongodb://localhost/attack-workspace
    export JSON_CONFIG_PATH="resources/sample-configurations/multiple-apikey-services.json"
    export WB_REST_SERVICE_ACCOUNT_CHALLENGE_APIKEY_ENABLE=true
    export NODE_EXTRA_CA_CERTS="path/to/cert.crt"    
    ```

- Ensure this file is sourced when starting the backend:

    ```bash
    source .rest-api-env
    ```

#### 3. Run the REST API

```
node ./bin/www
```

Or to run it in the background:

```
node ./bin/www &
```

## Setting Up the Frontend

#### 1. Install dependencies

Navigate to the `attack-workbench-frontend/app` directory and run

```
npm install
```

#### 2. Run the frontend locally

```
ng serve
```

Open your browser and navigate to `http://localhost:4200`


## Note: Recommended setup using Visual Studio Code Workspaces

To streamline your development workflow, you can configure a Visual Studio Code workspace for easier management of both the frontend and REST API repositories. Open VS Code in the `attack-workbench-frontend` directory, add the directory for the REST API repository, and save the workspace.

To automate terminal setups, ensure the "Restore Terminals" extension is installed in VS Code. Open the `.code-workspace` file in a text editor other than VS Code and configure the `restoreTerminals.runOnStartup` and `restoreTerminals.terminals` settings.

Example VS Code Workspace configuration:

```json
{
    "folders": [
        {
            "name": "attack-workbench-rest-api",
            "path": "attack-workbench-rest-api"
        },
        {
            "name": "attack-workbench-frontend",
            "path": "attack-workbench-frontend"
        }
    ],
    "settings": {
        "terminal.integrated.env.osx": {
            "DATABASE_URL": "mongodb://localhost/attack-workspace",
            "JSON_CONFIG_PATH": "resources/sample-configurations/multiple-apikey-services.json",
            "WB_REST_SERVICE_ACCOUNT_CHALLENGE_APIKEY_ENABLE": "true",
            "NODE_EXTRA_CA_CERTS": "path/to/cert.crt" 
        },
        "restoreTerminals.runOnStartup": true,
        "restoreTerminals.terminals": [
            {
                "splitTerminals": [
                    {
                        "name": "rest-api",
                        "commands": [
                            "cd ../attack-workbench-rest-api/",
                            "git checkout develop",
                            "git pull",
                            "npm ci",
                            "source /path/to/.rest-api-env",
                            "node bin/www"
                        ]
                    }
                ]
            },
            {
                "splitTerminals": [
                    {
                        "name": "frontend",
                        "commands": [
                            "cd ../attack-workbench-frontend/app/",
                            "git checkout develop",
                            "git pull",
                            "npm ci",
                            "ng serve --open"
                        ]
                    }
                ]
            }
        ]
    }
}
```