# Docker Compose Migration

The ATT&CK Workbench features a persistent database with the use of a named volume as of version 2.0. This change may result in data on the current anonymous volume being lost. This document describes how to backup your existing ATT&CK Workbench data and restore it after the update. This process only needs to be completed once.


## 1. Identify anonymous volume

The mongodb container has two anonymous volumes, only one of which contains the ATT&CK Workbench data. To find the name of the anonymous volume you should backup, perform the following command and make note of the string that precedes "/data/db". This will later be referred to as old_volume.
```
docker inspect --format "{{range .Mounts}}{{.Name}} {{println .Destination}}{{end}}" attack-workbench-database
```

## 2. Backup the volume

1. Create a temporary named volume
```
docker volume create --name temp
```

2. Run the command

```
docker run --rm -it -v <old_volume>:/from:ro -v temp:/to alpine ash -c "cd /from ; cp -av . /to"
```
This will install an `alpine` image and mount the volumes to a temporary container to perform the backup. Once this step is complete, the `temp` volume contains a backup of the database. 

## 3. Updating the install

1. Navigate to the `attack-workbench-frontend` directory (containing the `docker-compose.yml` file)
2. Rebuild the ATT&CK Workbench: 
```
docker-compose down
docker-compose up --build
```

This will rebuild the ATT&CK Workbench and may wipe the current data. The persistent database is now in use. 

3. Restore data 

```
docker run --rm -it -v temp:/from:ro -v attack-workbench-frontend_db-data:/to alpine ash -c "cd /from ; cp -av . /to"
docker restart attack-workbench-database
```

After restarting the database container, confirm that the ATT&CK Workbench contains the same data it did prior to the update by visiting `localhost` in your browser. 

4. Delete `temp` volume

Only delete the temp volume after confirming the database has been restored. 
```
docker volume rm temp
```
