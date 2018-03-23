#!/bin/sh

# copies mobile-wiki assets from provided image to destination path
# usage ./docker-build.sh <image-name> <destination_path>

IMAGE_NAME=$1
DEST_PATH=$2

echo "Copying assets"
CONTAINER_ID=$(docker run -d ${IMAGE_NAME})
docker cp ${CONTAINER_ID}:/app/dist/mobile-wiki/assets/ ${DEST_PATH}
docker stop ${CONTAINER_ID}
docker rm ${CONTAINER_ID}
echo "Assets copied"
