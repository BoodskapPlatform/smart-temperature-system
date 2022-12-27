FROM node:alpine3.16
LABEL maintainer="Boodskap <platform@boodskap.io>"

RUN npm install -g express

ENV APP_UI_HOME=/opt/boodskapui

RUN mkdir -p ${APP_UI_HOME}/logs

WORKDIR ${APP_UI_HOME}

COPY / ${APP_UI_HOME}/

RUN ls -la ${APP_UI_HOME}/

EXPOSE 4201

ENTRYPOINT node smart-temperature-web-node.js
