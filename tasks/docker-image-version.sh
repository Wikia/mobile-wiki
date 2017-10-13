#!/bin/sh

# usage ./docker-image-version <env>

# for non-prod releases VERSION results in <branch>-<7-chars-of-commit-hash>
# for prod releases VERSION results in latest git tag bumped by 1, eg. 23.001 => 24.001
ENV=${1:-dev}

VERSION=`git rev-parse --abbrev-ref HEAD`"-"`git describe --abbrev=7 | grep -o '[0-9a-z]\+$'`

if [ ${ENV} = "prod" ]
then
    VERSION=$( sh ./tasks/docker-tag-bump.sh $(git describe --abbrev=0 | grep -o '[0-9]\+\.[0-9]\+'))
fi

echo ${VERSION}