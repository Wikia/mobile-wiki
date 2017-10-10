#!/usr/bin/env bash

# usage ./yaml-descriptor <env> <image-name> [<dc>]
# - env: prod | staging
# - dc: sjc | res

ENV=$1
IMAGE=$2
# prod as a default value
NAMESPACE="prod"
DC=${3:-sjc}

if [ ${ENV} = "staging" ]
then
    NAMESPACE=${ENV}
fi

sed\
   -e "s/\${env}/$ENV/g"\
   -e "s/\${image}/$IMAGE/g"\
   -e "s/\${namespace}/$NAMESPACE/g"\
   -e "s/\${dc}/$DC/g"\
   k8s/k8s-descriptor-template.yaml > k8s/k8s-descriptor-"$ENV".yaml