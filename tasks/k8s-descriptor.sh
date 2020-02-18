#!/bin/sh

# usage ./yaml-descriptor <env> <image-name> [<dc>]
# - env: prod | preview | sandbox-* | verify
# - dc: sjc | res

ENV=$1
VERSION=$2
IMAGE=$3
DC=${4:-sjc}
DEPLOYMENT_TEMPLATE_NAME="k8s-deployment-descriptor-template.yaml"
SERVICE_TEMPLATE_NAME="k8s-service-descriptor-template.yaml"

if expr "${ENV}" : "prod" 1>/dev/null; then
    DEPLOYMENT_TEMPLATE_NAME="k8s-deployment-descriptor-template-prod.yaml"
    SERVICE_TEMPLATE_NAME="k8s-service-descriptor-template-prod.yaml"
fi

sed\
   -e "s~\${env}~$ENV~g"\
   -e "s~\${image}~$IMAGE~g"\
   -e "s~\${dc}~$DC~g"\
   -e "s~\${version}~$VERSION~g"\
   k8s/${DEPLOYMENT_TEMPLATE_NAME} > k8s/k8s-deployment-descriptor-${ENV}.yaml

sed\
   -e "s~\${env}~$ENV~g"\
   -e "s~\${image}~$IMAGE~g"\
   -e "s~\${dc}~$DC~g"\
   -e "s~\${version}~$VERSION~g"\
   k8s/${SERVICE_TEMPLATE_NAME} > k8s/k8s-service-descriptor-${ENV}.yaml
