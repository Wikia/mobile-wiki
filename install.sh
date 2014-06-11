#!/bin/sh

npm install
npm install -g bower jshint gulp forever tsd typescript-formatter hakubo/bower-installer
bower-installer
tsd update
