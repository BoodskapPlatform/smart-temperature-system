#!/bin/bash

npm install

node build.js

VERSION=$(cat package.json | /usr/bin/jq -r '.version')

docker build -t boodskapiot/lht65:${VERSION} . -f Dockerfile

docker push boodskapiot/lht65:${VERSION}
