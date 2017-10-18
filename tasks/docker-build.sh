#!/bin/sh

# usage ./docker-build.sh <image-name>

IMAGE_NAME=$1

echo "Building mobile-wiki image for production environment"

docker build -t ${IMAGE_NAME} .

# push prod image to remote repository
docker push ${IMAGE_NAME}
