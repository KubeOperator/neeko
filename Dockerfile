FROM node:14-alpine as stage-build

WORKDIR /data

RUN echo > /etc/apk/repositories && \
    echo -e "https://dl-cdn.alpinelinux.org/alpine/v3.15/main\nhttps://dl-cdn.alpinelinux.org/alpine/v3.15/community" >> /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add python2 make gcc g++

COPY ./package.json /data/package.json
COPY ./package-lock.json /data/package-lock.json
RUN npm install
COPY . /data
RUN npm run-script build

FROM nginx:alpine

COPY --from=stage-build /data/dist /opt/neeko
COPY nginx.conf /etc/nginx/conf.d/default.conf
