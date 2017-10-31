#!/bin/sh

# usage ./yaml-descriptor <env> <image-name> [<dc>]
# - env: prod | staging | preview | sandbox-* | stable | verify
# - dc: sjc | res

ENV=$1
IMAGE=$2
DC=${3:-sjc}
TEMPLATE_NAME="k8s-descriptor-template-${ENV}.yaml"

if expr "${ENV}" : "^sandbox-" 1>/dev/null; then
    TEMPLATE_NAME="k8s-descriptor-template-sandbox.yaml"
fi

sed\
   -e "s~\${env}~$ENV~g"\
   -e "s~\${image}~$IMAGE~g"\
   -e "s~\${dc}~$DC~g"\
   k8s/${TEMPLATE_NAME} > k8s/k8s-descriptor-${ENV}.yaml