#!/bin/sh

# usage ./docker-build.sh <image-name> <image-version> <gh-token>

IMAGE_NAME=$1
IMAGE_VERSION=$2
GITHUB_TOKEN=$3

echo "Building mobile-wiki image for production environment"

docker build -f Dockerfile.prod -t ${IMAGE_NAME} --build-arg IMAGE_VERSION=${IMAGE_VERSION} --build-arg GITHUB_TOKEN=${GITHUB_TOKEN} .

# push prod image to remote repository
docker push ${IMAGE_NAME}
