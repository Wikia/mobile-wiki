#!/bin/sh

# usage ./docker-push <image-name>

TARGET="artifactory.wikia-inc.com/mobile-wiki/"$1

docker push ${TARGET}