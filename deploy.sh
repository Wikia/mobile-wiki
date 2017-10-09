#!/usr/bin/env bash

# usage ./deploy.sh <env> [<DC>]
ENV=$1
DC=${2:-sjc}

IMAGE_NAME=`./tasks/docker-image-name.sh ${ENV}`

./tasks/docker-build.sh ${IMAGE_NAME} && ./tasks/docker-push.sh ${IMAGE_NAME} && ./tasks/k8s-descriptor.sh ${ENV} ${IMAGE_NAME} ${DC}