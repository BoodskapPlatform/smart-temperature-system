FROM node:alpine3.16
LABEL maintainer="Boodskap <platform@boodskap.io>"

RUN npm install -g express

ENV APP_HOME=/opt/smart-temperature-system

RUN mkdir -p ${APP_HOME}/logs

WORKDIR ${APP_HOME}

COPY / ${APP_HOME}/

EXPOSE 10092

CMD exec node smart-temperature-web-node.js
