#!/bin/sh

#usage ./docker-image-name <description>

VERSION=`git rev-parse --abbrev-ref HEAD`"-"`git describe | grep -o '[0-9a-z]\+$'`
echo "artifactory.wikia-inc.com/mobile-wiki/mobile-wiki-deps:"${VERSION}