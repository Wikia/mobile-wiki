#!/bin/sh

#usage ./docker-image-name <env>
ENV=$1

VERSION=`git rev-parse --abbrev-ref HEAD`"-"`git describe | grep -o '[0-9a-z]\+$'`

if [ ${ENV} = "prod" ]
then
    VERSION=`git describe | grep -o '[0-9]\+\.[0-9]\+'`
fi

echo "artifactory.wikia-inc.com/mobile-wiki/mobile-wiki:"${VERSION}