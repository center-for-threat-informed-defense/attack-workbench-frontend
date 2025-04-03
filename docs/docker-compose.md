# Docker Compose Installation

This document describes how to install the ATT&CK Workbench components using Docker Compose. This project (ATT&CK Workbench Frontend) includes a `docker-compose.yml` file that configures the Docker Compose installation.

## 1. Download required repositories

In addition to this project, the [ATT&CK Workbench REST API](https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api) project must be pulled from its github repository.

These projects must be placed under a common parent directory:

```
|-- <common parent directory>
    |-- attack-workbench-frontend
    |-- attack-workbench-rest-api
```

To perform all clones as required (including the clone of this repository), you can use the following commands from your working directory:
```shell
# download the front-end repository
git clone https://github.com/center-for-threat-informed-defense/attack-workbench-frontend.git
# download the REST API repository
git clone https://github.com/center-for-threat-informed-defense/attack-workbench-rest-api.git
```

## 2. Docker images

Docker images can either be built locally or pulled from the Github Container Registry. 

### Build docker images
1. Navigate to the `attack-workbench-frontend/docker/compose` directory (containing the `compose.yml` file)
2. Run the command<sup>1</sup>:
```shell
docker compose up
```

<sup>1</sup>NOTE: Older versions of docker may need to use `docker-compose` (with the hyphen).

This command will build all of the necessary Docker images and run the corresponding Docker containers.

### Using pre-built images
1. Use the following commands to pull the images from the Github Container Registry. Replace the image tag with the version number you are using. If no image is specified, `latest` will be pulled. 
```
docker pull ghcr.io/center-for-threat-informed-defense/attack-workbench-frontend:<TAG>
docker pull ghcr.io/center-for-threat-informed-defense/attack-workbench-rest-api:<TAG>
```
1. Navigate to the `attack-workbench-frontend/docker/compose` directory, and modify the `compose.yml` file. Replace the `build` attribute with the corresponding `image`. 
```
version: "3.9"
services:
  frontend:
    container_name: attack-workbench-frontend
    image: ghcr.io/center-for-threat-informed-defense/attack-workbench-frontend:<TAG>
    depends_on:
...
  rest-api:
    container_name: attack-workbench-rest-api
    image: ghcr.io/center-for-threat-informed-defense/attack-workbench-rest-api:<TAG>
    depends_on:
...
```
1. Run the command<sup>1</sup>:
```shell
docker compose up
```

## 3. Access Docker instance

With the docker-compose running you can access the ATT&CK Workbench application by visiting the URL `localhost` in your browser.


## Updating an existing install

If you have previously built the Workbench and want to rebuild based on a newer release of the codebase, the following command can be used to force a rebuild of the data. Before running it, make sure that all three repositories are up-to-date with the head of the branch (typically `develop` or `master`) to ensure that compatibility issues don't occur between the components.

```
docker compose up --build
```

## Containers

When deployed using Docker Compose, an ATT&CK Workbench installation will include three containers:
* frontend
* rest-api
* mongodb

These containers will communicate as illustrated in the diagram below.
The `nginx` instance (part of the `frontend` container) is responsible for serving the statically built code for the ATT&CK Workbench web application.
It also acts as a reverse proxy for the `rest-api` service.

![Workbench Configuration](images/workbench-configuration-docker-compose.png)

Note that the `compose.yml` file exposes the ATT&CK Workbench web application on port 80.
The `nginx` configuration file (`nginx/nginx.conf`) can be modified to use HTTPS and port 443, depending on your operational requirements.

## PKI Certificates

For additional troubleshooting and installation of security certificates for use by ATT&CK Workbench, pleaser refer to [PKI Certificates instructions](certs.md).
