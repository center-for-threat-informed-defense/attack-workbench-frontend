FROM node:14 as build

LABEL org.opencontainers.image.title="ATT&CK Workbench Frontend Service" \
    org.opencontainers.image.description="This Docker image contains the frontend service of the ATT&CK Workbench, an application for exploring, creating, annotating, and sharing extensions of the MITRE ATT&CK® knowledge base. The service handles the storage, querying, and editing of ATT&CK objects. It is an Angular SPA served by an Nginx reverse proxy." \
    org.opencontainers.image.source="https://github.com/center-for-threat-informed-defense/attack-workbench-frontend" \
    org.opencontainers.image.documentation="https://github.com/center-for-threat-informed-defense/attack-workbench-frontend/README.md" \
    org.opencontainers.image.url="https://ghcr.io/center-for-threat-informed-defense/attack-workbench-frontend" \
    org.opencontainers.image.vendor="The MITRE Corporation" \
    org.opencontainers.image.licenses="Apache-2.0" \
    org.opencontainers.image.authors="MITRE ATT&CK<attack@mitre.org>"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./app/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Copy the app source
COPY ./app .

# Copy the docs--angular looks for them in a sibling directory
COPY ./docs ../docs

# Build the bundle
RUN npm run build-prod

FROM nginx:1.19

# Remove the default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Note: The nginx config file must be included as a volume at /etc/nginx/nginx.conf

# Copy the application bundles
COPY --from=build  /usr/src/app/dist/app /usr/share/nginx/html


