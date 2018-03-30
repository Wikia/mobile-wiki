#!/bin/sh

# uploads mobile-wiki assets from provided image to dfs buckets (res and sjc)
# usage ./docker-build.sh <image-name> <sjc-access-key> <sjc-secret-key> <res-access-key> <res-secret-key>

IMAGE_NAME=$1
SJC_ACCESS_KEY=$2
SJC_SECRET_KEY=$3
RES_ACCESS_KEY=$4
RES_SECRET_KEY=$5

TEMP_PATH="$(pwd)/dfs"

echo "Copying assets"
CONTAINER_ID=$(docker run -d ${IMAGE_NAME})
docker cp ${CONTAINER_ID}:/app/dist/mobile-wiki/assets/ ${TEMP_PATH}
docker stop ${CONTAINER_ID}
docker rm ${CONTAINER_ID}
echo "Assets copied"

echo "Uploading assets to sjs"
docker run --rm -v ${TEMP_PATH}:/assets artifactory.wikia-inc.com/xwing/s3cmd-alpine:0.0.2 s3cmd -c sjc --access_key=${SJC_ACCESS_KEY} --secret_key=${SJC_SECRET_KEY} put --acl-public --recursive /assets s3://mobile-wiki-assets

echo "Uploading assets to res"
docker run --rm -v ${TEMP_PATH}:/assets artifactory.wikia-inc.com/xwing/s3cmd-alpine:0.0.2 s3cmd -c res --access_key=${RES_ACCESS_KEY} --secret_key=${RES_SECRET_KEY} put --acl-public --recursive /assets s3://mobile-wiki-assets
