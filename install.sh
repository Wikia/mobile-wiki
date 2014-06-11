#!/bin/sh

npm install
npm install -g bower jshint gulp forever tsd typescript-formatter bower-installer
bower-installer
tsd update
