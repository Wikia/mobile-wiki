#!/bin/sh

# usage ./docker-dev-build.sh <image-name> <image-version>

IMAGE_NAME=$1
IMAGE_VERSION=$2

echo "Building mobile-wiki image for development environment"

docker build -f Dockerfile.dev -t ${IMAGE_NAME} --build-arg IMAGE_VERSION=${IMAGE_VERSION} .

# push deps image to remote repository
docker push ${IMAGE_NAME}
