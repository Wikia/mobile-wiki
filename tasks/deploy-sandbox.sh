#!/usr/bin/env bash

# usage ./tasks/deploy-sandbox.sh <sandbox-name>
# Note that it takes code from current branch, all changes needs to be committed

SANDBOX_NAME=$1

if ! [[ $SANDBOX_NAME =~ ^sandbox-[a-z0-9]{2,} ]]; then
    echo "Incorrect sandbox-name"
    exit 1
fi

git diff-index --quiet HEAD --
CHANGES=$?

if [ $CHANGES -ne 0 ]; then
    echo "There are uncommitted changes, please stash them or commit"
    exit 1
fi


UNTRACKED_FILES=`git ls-files --others --exclude-standard`

if [[ $UNTRACKED_FILES =~ .+ ]]; then
    echo "There are untracked files, please remove them or commit"
    exit 1
fi


COMMIT_HASH=`git rev-parse --short=7 HEAD`
BRANCH=`git symbolic-ref --short -q HEAD`

if [ $? -ne 0 ]; then
    echo "Can not determine branch name, the HEAD is probably detached"
    exit 1
fi

IMAGE_VERSION="${BRANCH}-${COMMIT_HASH}"
IMAGE_NAME="artifactory.wikia-inc.com/mobile-wiki:${IMAGE_VERSION}"
PREVIOUS_IMAGE=`ssh k8s-controller-s1 "kubectl get deployment mobile-wiki-${SANDBOX_NAME} -n prod -o=jsonpath='{$.spec.template.spec.containers[:1].image}'"`

echo "Going to deploy ${IMAGE_NAME}"
echo "Previous image: ${PREVIOUS_IMAGE}"

read -r -p "Are you sure? [y/N] " response

if ! [[ "$response" =~ ^[Yy]([Ee][Ss])?$ ]]; then
    exit 0
fi

./tasks/docker-dev-build.sh ${IMAGE_NAME}

echo "Generating k8s descriptor"

./tasks/k8s-descriptor.sh ${SANDBOX_NAME} ${IMAGE_NAME}

DESCRIPTOR_FILE="k8s-descriptor-${SANDBOX_NAME}.yaml"
scp "k8s/${DESCRIPTOR_FILE}" k8s-controller-s1:~/
rm "k8s/${DESCRIPTOR_FILE}"

# ssh k8s-controller-s1 "kubectl apply -f ${DESCRIPTOR_FILE} -n prod"
