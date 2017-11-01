#!/bin/sh

# usage ./docker-dev-build.sh <image-name>

IMAGE_NAME=$1

echo "Building mobile-wiki image for development environment"

docker build -f Dockerfile.dev -t ${IMAGE_NAME} .

# push image to remote repository
docker push ${IMAGE_NAME}
