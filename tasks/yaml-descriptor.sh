#!/usr/bin/env bash

#usage ./yaml-descriptor <prod> <image-name> [<namespace>]

ENV="$1"
IMAGE="$2"
# prod as a default value
NAMESPACE="${3:-prod}"

sed\
   -e "s/\${env}/$ENV/g"\
   -e "s/\${image}/$IMAGE/g"\
   -e "s/\${namespace}/$NAMESPACE/g"\
   k8s/k8s-descriptor-template.yaml > k8s/k8s-descriptor-"$ENV".yaml