# ATT&CK Workbench Docker Update Guide for v1.3.1 to v2.0

## Overview

When updating from ATT&CK Workbench v1.3.1 to v2.0, the major change (from install perspective) is the removal of the Collection Manager component. To do so, an existing instance of ATT&CK Workbench must be stopped, Collection Manager components removed, new Frontend and REST API components downloaded, and then Frontend and REST API components restarted. The instructions below detail the steps to updating ATT&CK Workbench Docker setup.

## Instructions

1. Stop the current running ATT&CK Workbench

**Warning:** Do not use `docker-compose down`, that will remove all the underlying docker containers and we dont want to delete the mongo database container.

```sh
cd attack-workbench-frontend
docker compose stop
```

2. Delete current docker containers and images for `workbench-frontend`, `workbench-rest-api`, and `workbench-collection-manager`

```sh
docker container rm attack-workbench-rest-api attack-workbench-frontend attack-workbench-collection-manager

docker rmi attack-workbench-frontend-frontend attack-workbench-frontend-rest-api attack-workbench-frontend-collection-manager
```

3. Delete Collection Manager repository (directory)

```sh
rm -r attack-workbench-collection-manager
```

4. If you use custom settings, save environment (configuration) files

If you have existing custom ATT&CK Workbench environment configurations, make sure to save the corresponding environment files. They will be overwritten with next step when the new ATT&CK Workbench version is cloned.

Configuration files for ATT&CK Workbench Frontend are found here:  
- [src/environments/environment.ts](app/src/environments/environment.ts)
- [src/environments/environment.prod.ts](app/src/environments/environment.prod.ts)

5. Clone latest version of ATT&CK Workbench Frontend and REST API

```sh
cd attack-workbench-frontend
git checkout master
git pull origin master

cd attack-workbench-rest-api
git checkout master
git pull origin master
```

6. If you use custom settings, update environment (configuration) files

Following from Step 3., if you have used custom environment settings you will need to update the settings in the new (and reset) environment files.

**NOTE**: The new environment files do not have a `collection_manager` section so do not re-add that section back in to the environment file(s).

Configuration files for ATT&CK Workbench Frontend are found here:  
- [src/environments/environment.ts](app/src/environments/environment.ts)
- [src/environments/environment.prod.ts](app/src/environments/environment.prod.ts)


7. Restart ATT&CK Workbench with updated ATT&CK Workbench Frontend and REST API components

```sh
cd attack-workbench-frontend
docker compose up
```

Alternatively, if also using custom SSL certs

```sh
cd attack-workbench-frontend
docker-compose -f docker-compose.yml -f docker-compose.certs.yml up
```
