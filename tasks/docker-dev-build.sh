#!/bin/sh

# usage ./docker-dev-build.sh <image-name> [<crowdin_branch>]

IMAGE_NAME=$1
CROWDIN_BRANCH=$2

echo "Building mobile-wiki image for development environment"

docker build -f Dockerfile.dev -t ${IMAGE_NAME} . --build-arg crowdin_branch=master

# push deps image to remote repository
docker push ${IMAGE_NAME}
