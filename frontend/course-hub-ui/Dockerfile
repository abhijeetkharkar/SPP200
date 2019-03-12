# Stage 0, build staging app
FROM tiangolo/node-frontend as build-stage

RUN mkdir -p /home/react/app/ && chown -R node:node /home/react/app/

WORKDIR /home/react/app

COPY package*.json /home/react/app/

USER node
RUN npm install

# copying all the files in the folder
COPY --chown=node:node . .

RUN npm run build-prod


# Stage 1
FROM nginx:1.15

COPY --from=build-stage /home/react/app/dist/ /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf