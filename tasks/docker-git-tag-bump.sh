#!/bin/sh

# usage ./docker-git-tag-bump.sh <version>

VERSION=$1
BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
COMMIT_HASH=`git rev-parse --short=7 HEAD`
TAG_NAME="release-${VERSION}"

# if tag exists
if [ -z $(git tag --list ${TAG_NAME}) ]
then
    git tag --annotate --message ${TAG_NAME} ${TAG_NAME}
    git push origin ${TAG_NAME}
echo ${TAG_NAME}
else
    echo "Tag already exist"
fi