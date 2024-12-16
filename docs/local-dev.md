# Local Development Documentation

This document outlines how to set up ATT&CK Workbench for local development.

---

## Prerequisites

Before running the application locally, ensure you have the following set up:

### Clone the Required Repositories

1. Clone the [attack-workbench-frontend](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend) repository.
2. Clone the [attack-workbench-rest-api](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api) repository alongside the frontend.

### Install Dependencies

1. **MongoDB**:  

    If you're on macOS:
    - Tap the MongoDB Homebrew Tap: `brew tap mongodb/brew`
    - Update Homebrew: `brew update`
    - Install MongoDB: `brew install mongodb-community@8.0`
    - Start MongoDB as a macOS service: `brew services start mongodb-community@8.0`

    For more details, refer to the official [MongoDB installation guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/).

2. **Dependencies for the REST API**:  

    Navigate to the `attack-workbench-rest-api` directory and run `npm install`

3. **Dependencies for the Frontend**:  

    Navigate to the `attack-workbench-frontend/app` directory and run `npm install`

4. **Restore Terminals Extension**:  
    
    Install the "Restore Terminals" extension in VS Code from the Extensions Marketplace. This will allow automatic terminal configuration when using a workspace.

---
## Running the Application Locally

Once prerequisites are complete, choose one of the following methods to run the application:

### Option 1: Using Docker

1. Build the Docker containers:  

    `docker compose build`

    Note: You must rerun this command to see local changes.
2. Run the containers:  

    `docker compose up`

### Option 2: Using `ng serve`

1. Ensure the REST API is running by navigating to the `attack-workbench-rest-api` directory and running `node ./bin/www`  
    
    Or to run it in the background:  
    `node ./bin/www &`

2. Navigate to the frontend application directory: `cd attack-workbench-frontend/app`

3. Serve the application locally by running `ng serve`

4. Open your browser and navigate to `http://localhost:4200`


---

## Using VS Code Workspaces

Alternatively, you can configure a Visual Studio Code workspace for easier management of both the frontend and backend repositories.

### Setting Up the Workspace

1. Open VS Code in the **attack-workbench-frontend** directory.
2. Add the backend repository to the workspace:
    - Click on **File** > **Add Folder to Workspace**.
    - Select the **attack-workbench-rest-api** folder.
3. Save the workspace:
    - Click **File** > **Save Workspace As**.
    - Name the workspace, e.g., `workbench-development`.

### Automating Terminals in the Workspace

To streamline your workflow, create a `workbench-development.code-workspace` file in the root directory containing both repositories. Use the following structure, changing paths where necessary:

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
            "WORKBENCH_AUTHN_APIKEY": "sample-navigator-apikey",
            "WB_REST_SERVICE_ACCOUNT_CHALLENGE_APIKEY_ENABLE": "true",
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
                            "npm i",
                            "source ~/.bashrc",
                            "source ../.rest-api-env",
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
                            "ng serve --open"
                        ]
                    },
                    {
                        "name": "front-end",
                        "commands": [
			    "cd ../attack-workbench-frontend/app/"
			]
                    }
                ]
            }
        ]
    }
}
```

---

### Environment Configuration

Create a `.rest-api-env` file in the root directory containing your workspace. Add the following content:

```json
export DATABASE_URL=mongodb://localhost/attack-workspace # defined in bashrc
export JSON_CONFIG_PATH="resources/sample-configurations/collection-manager-apikey.json"
export WB_REST_SERVICE_ACCOUNT_CHALLENGE_APIKEY_ENABLE=true
export NODE_EXTRA_CA_CERTS="path/to/MITRE-chain.crt"    
```

Ensure this file is sourced when starting the backend:  

`source .rest-api-env`

---

### Final Steps

1. Open the saved workspace in VS Code.

2. Ensure the "Restore Terminals" extension is installed to automate terminal setups for the REST API and frontend.

3. You should now be able to log in and interact with the application at `http://localhost:4200`.