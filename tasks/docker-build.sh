#!/bin/sh

# usage ./docker-build <image-name>

TARGET="artifactory.wikia-inc.com/mobile-wiki/"$1

docker build . -t ${TARGET}