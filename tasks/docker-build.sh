#!/bin/sh

#usage ./docker-build.sh <env>

# we're creating tags for both images
DEPS=$(sh ./tasks/docker-image-name-deps.sh)
BUILD=$(sh ./tasks/docker-image-name.sh)

################
## deps stage ##
################
echo Building mobile-wiki-deps image

docker build -f Dockerfile.build -t ${DEPS} .

# we have to create a container to copy it's artifact
docker create --name temporary-container ${DEPS}

# we're creating a temporary directory to store artifact from deps-image
# keep it in sync with directory name used in "Dockerfile" to copy content from
mkdir ./docker_temp_container

# we're copying files from artifact to temporary directory
docker cp temporary-container:/app/dist ./docker_temp_container
docker cp temporary-container:/app/fastboot-server ./docker_temp_container
docker cp temporary-container:/app/config  ./docker_temp_container
docker cp temporary-container:/app/lib  ./docker_temp_container
docker cp temporary-container:/app/package.json  ./docker_temp_container
docker cp temporary-container:/app/bower.json  ./docker_temp_container

docker cp temporary-container:/app/prod_dependencies/node_modules ./docker_temp_container
docker cp temporary-container:/app/prod_dependencies/bower_components ./docker_temp_container

# temporary container is not needed anymore so we're removing it
docker rm -f temporary-container

# push deps image to remote repository
docker push ${DEPS}

#################
## build stage ##
#################
echo Building mobile-wiki-build image

# we're using --no-cache to force rebuilding every stage every time
docker build --no-cache -t ${BUILD} .

# temporary directory is not needed anymore so we're removing it
rm -rf ./docker_temp_container

# push build image to remote repository
docker push ${BUILD}