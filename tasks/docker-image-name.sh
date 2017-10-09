#!/usr/bin/env bash

#usage ./docker-image-name <env>

VERSION=`git describe | grep -o '[0-9a-z]\+$'`
echo "mobile-wiki-"$1":"${VERSION}