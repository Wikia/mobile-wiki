#!/bin/sh

npm install
sudo npm install -g bower jshint gulp forever tsd typescript-formatter
bower install
tsd update --overwrite
