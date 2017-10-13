#!/bin/sh

# usage ./docker-deps-build.sh

# create tag for image
DEV_TAG_NAME=$(sh ./tasks/docker-image-name.sh)

echo "Building mobile-wiki image for development environment"

docker build -f Dockerfile.dev -t ${DEV_TAG_NAME} .

# push deps image to remote repository
docker push ${DEV_TAG_NAME}
