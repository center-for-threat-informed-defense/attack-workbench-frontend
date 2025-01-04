# Local Development Documentation

This document outlines how to set up ATT&CK Workbench for local development. For Docker installation instructions, please refer to the [docker install instructions](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/blob/master/docs/docker-compose.md).

## Prerequisites

Before running the application locally, ensure you have the following set up:

### Clone the Required Repositories

1. Clone the [attack-workbench-frontend](https://github.com/center-for-threat-informed-defense/attack-workbench-frontend) repository.
2. Clone the [attack-workbench-rest-api](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api) repository alongside the frontend.

### Install MongoDB

If you're on macOS:
- Tap the MongoDB Homebrew Tap: `brew tap mongodb/brew`
- Update Homebrew: `brew update`
- Install MongoDB: `brew install mongodb-community@8.0`
- Start MongoDB as a macOS service: `brew services start mongodb-community@8.0`

For more details, refer to the official [MongoDB installation guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/).

## Setting Up the REST API

### Install Dependencies for the REST API

Navigate to the `attack-workbench-rest-api` directory and run `npm install`

### Running the REST API
1. Ensure the REST API is running by navigating to the `attack-workbench-rest-api` directory and running `node ./bin/www`  
    
    Or to run it in the background: `node ./bin/www &`

## Setting Up the Frontend

### Install Dependencies for the Frontend
Navigate to the `attack-workbench-frontend/app` directory and run `npm install`

### Running the Frontend


1. Navigate to the frontend application directory: `cd attack-workbench-frontend/app`

2. Serve the application locally by running `ng serve`

3. Open your browser and navigate to `http://localhost:4200`


## Note: Using VS Code Workspaces
To streamline your development workflow, you can configure a Visual Studio Code workspace for easier management of both the frontend and REST API repositories. Open VS Code in the attack-workbench-frontend directory, add the REST API repository, and save the workspace. To automate terminal setups, create a workbench-development.code-workspace file in the root directory. For some internal setups, you may need a .rest-api-env file. Ensure the "Restore Terminals" extension is installed in VS Code to automate terminal setups.
