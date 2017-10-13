#!/bin/sh

# usage ./docker-image-name <env>

ENV=${1:-dev}

VERSION=$( sh ./tasks/docker-image-version.sh ${ENV})

echo "artifactory.wikia-inc.com/mobile-wiki/mobile-wiki:"${VERSION}