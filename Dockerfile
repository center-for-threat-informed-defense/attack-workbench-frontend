FROM node:10 as build

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

# Copy the nginx config file
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the application bundles
COPY --from=build  /usr/src/app/dist/app /usr/share/nginx/html


