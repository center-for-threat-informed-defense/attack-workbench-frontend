# ATT&CK Workbench Docker Install Update Guide for v1.3.1 to v2.0.0

When updating from ATT&CK Workbench v1.3.1 to v2.0.0, the major changes are the removal of the Collection Manager component and the migration to a named volume. The change to a named volume may result in data on the current anonymous volume being lost. This document describes how to backup your existing ATT&CK Workbench data and restore it after the update. This process only needs to be completed once.

### 1. Identify anonymous volume

The mongodb container has two anonymous volumes, only one of which contains the ATT&CK Workbench data. To find the name of the anonymous volume you should backup, perform the following command and make note of the string that precedes "/data/db". This will later be referred to as `old_volume`.

```sh
docker inspect --format "{{range .Mounts}}{{.Name}} {{println .Destination}}{{end}}" attack-workbench-database
```

### 2. Backup the volume

Create a temporary named volume

```sh
docker volume create --name temp
```

Run the following command, replacing `<old_volume>` with the string identified in Step 1

```sh
docker run --rm -it -v <old_volume>:/from:ro -v temp:/to alpine ash -c "cd /from ; cp -av . /to"
```

This will install an `alpine` image and mount the volumes to a temporary container to perform the backup. Once this step is complete, the `temp` volume contains a backup of the database. 

### 3. Stop the ATT&CK Workbench and remove outdated Docker containers

```sh
cd attack-workbench-frontend
docker compose down
```

### 4. Remove Collection Manager repository

```sh
rm -r ../attack-workbench-collection-manager
```

### 5. Backup custom environment configurations

If you have existing custom ATT&CK Workbench environment configurations, backup the corresponding environment files. They will be overwritten with next step when the ATT&CK Workbench is updated.

Configuration files for ATT&CK Workbench Frontend are found here:  
- [src/environments/environment.ts](app/src/environments/environment.ts)
- [src/environments/environment.prod.ts](app/src/environments/environment.prod.ts)

### 6. Update to the latest version of ATT&CK Workbench

Clone the latest version of ATT&CK Workbench Frontend and REST API

```sh
cd attack-workbench-frontend
git checkout master
git pull origin master

cd attack-workbench-rest-api
git checkout master
git pull origin master
```

### 7. Restore custom environment configurations

Following from Step 5, if you have custom environment settings, you will need to update the settings in the new environment files. **NOTE**: The new environment files do not have a `collection_manager` section; do not re-add that section back in to the environment file(s).

Configuration files for ATT&CK Workbench Frontend are found here:  
- [src/environments/environment.ts](app/src/environments/environment.ts)
- [src/environments/environment.prod.ts](app/src/environments/environment.prod.ts)

### 8. Restart ATT&CK Workbench

Rebuild the ATT&CK Workbench with updated Frontend and REST API components.

```sh
cd attack-workbench-frontend
docker compose up --build
```

Alternatively, if using custom SSL certs

```sh
cd attack-workbench-frontend
docker compose -f compose.yml -f compose.certs.yml up --build
```

The persistent database is now in use.

### 9. Restore data from backup

```sh
docker run --rm -it -v temp:/from:ro -v attack-workbench-frontend_db-data:/to alpine ash -c "cd /from ; cp -av . /to"
docker restart attack-workbench-database
```

After restarting the database container, confirm that the data backup was restored in the ATT&CK Workbench by visiting `localhost` in your browser.

Only delete the `temp` volume after confirming the database has been restored.

```sh
docker volume rm temp
```