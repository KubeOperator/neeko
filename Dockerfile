FROM node:14-alpine3.15 as stage-build

WORKDIR /data

RUN apk update && \
    apk upgrade

COPY ./package.json /data/package.json
COPY ./package-lock.json /data/package-lock.json
RUN npm install
COPY . /data
RUN npm run-script build

FROM nginx:alpine

COPY --from=stage-build /data/dist /opt/neeko
COPY nginx.conf /etc/nginx/conf.d/default.conf
