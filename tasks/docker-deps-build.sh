#!/bin/sh

#usage ./docker-deps-build.sh

# we're creating tags for image
DEPS=$(sh ./tasks/docker-deps-image-name.sh $(sh ./tasks/docker-deps-version.sh))

echo Building mobile-wiki-deps image

docker build -f Dockerfile.build -t ${DEPS} .

# push deps image to remote repository
docker push ${DEPS}
