# PKI Certificates

## Adding PKI Certficates to ATT&CK Workbench

Depending on deployment environments, the ATT&CK Workbench application may need additional specification of appropriate security certificates. Follow the below instructions to load desired certificates for use by ATT&CK Workbench.

1. Place the desired PKI certifications file in the ATT&CK Workbench Frontend repo/directory here:
```
/attack-workbench-frontend/certs
```

2. Edit the `attack-workbench-frontend/docker-compose.certs.yml` file to specify the certificate filename.

- Edit/complete the directory path of the certificates file under the `volumes:` section.
- Edit/complete the file path of the certificates file under the `environments:` section.


**docker-compose.certs.yml**
```yaml
# Description
# - This file augments the deployment of the ATT&CK Workbench by configuring the collection-manager container
# - with an additional certificate.
# - This is recommended for deployments where the collection-manager container is behind a firewall that performs
#   SSL inspection. The additional certificate allows collection-manager to retrieve collection-indexes and
#   collection bundles without receiving a self-signed certificate error.

# Usage
# This file must be used in conjunction with the main docker-compose.yml file.
#
# Environment Variables
# HOST_CERTS_PATH: path to the directory on the host where the certificate file is located
# CERTS_FILENAME: name of the certificate file
#
# Running docker compose at the command line:
# docker-compose -f docker-compose.yml -f docker-compose.certs.yml up

version: "3.9"
services:
  collection-manager:
    volumes:
      - ${HOST_CERTS_PATH}:/usr/src/app/certs            # << CHANGE "${HOST_CERTS_PATH}"
    environment:
      - NODE_EXTRA_CA_CERTS=./certs/${CERTS_FILENAME}    # << CHANGE "${CERTS_FILENAME}"
```

3. Then, upon startup on ATT&CK Workbench, use the following docker-compose command to include the additional `docker-compose.certs.yml` file.

```
docker-compose -f docker-compose.yml -f docker-compose.certs.yml up
```