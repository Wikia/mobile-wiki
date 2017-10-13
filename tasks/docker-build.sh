#!/bin/sh

# usage ./docker-build.sh

# create tag for image
PROD_TAG_NAME=$(sh ./tasks/docker-image-name.sh "prod")

echo "Building mobile-wiki image for production environment"

docker build -t ${PROD_TAG_NAME} .

# push prod image to remote repository
docker push ${PROD_TAG_NAME}
