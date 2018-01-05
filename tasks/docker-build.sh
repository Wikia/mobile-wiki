#!/bin/sh

# usage ./docker-build.sh <image-name> <image-version>

IMAGE_NAME=$1
IMAGE_VERSION=$2

echo "Building mobile-wiki image for production environment"

docker build -f Dockerfile.prod -t ${IMAGE_NAME} --build-arg IMAGE_VERSION=${IMAGE_VERSION} .

# push prod image to remote repository
docker push ${IMAGE_NAME}
