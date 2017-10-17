#!/bin/sh

# usage ./docker-image-version <env>

# for non-prod releases VERSION results in <branch>-<7-chars-of-commit-hash>
# for prod/preview/verify releases VERSION:
# results in latest git tag bumped by major 1, eg. 23.001 => 24.001, when tag for current release does not exist
# results in latest git tag bumped by minor 1, eg. 23.001 => 23.002, when tag for current release exists
ENV=${1:-dev}
BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
COMMIT_HASH=`git rev-parse --short=7 HEAD`
PREV_TAG=`git describe --abbrev=0 | grep -o '[0-9]\+\.[0-9]\+'` # eg. 34.001
PREV_MAJOR_VERSION=$(echo "$PREV_TAG" | cut -d . -f 1) # 34
PREV_MINOR_VERSION=$(echo "$PREV_TAG" | cut -d . -f 2) # 001

bump_major(){
    echo $((PREV_MAJOR_VERSION+1))"."$(printf '%0.3d\n' ${PREV_MINOR_VERSION}) # 35.001
}

bump_minor(){
    echo ${PREV_MAJOR_VERSION}"."$(printf '%0.3d\n' $((PREV_MINOR_VERSION+1)))
}

# bump tags only on preview env, when such tag does not exist and from branch that matches 'release-XX' pattern
if [ ${ENV} = "preview" ] && [[ ${BRANCH_NAME} =~ ^release-[0-9]+$ ]]
then
    # when 'XX' is equal to previous tag's major version + 1 it's necessary to create a new major tag
    if [[ "${BRANCH_NAME}" == *"$((PREV_MAJOR_VERSION+1))" ]];
    then
        VERSION=$(bump_major)
    else
    # when 'XX' is equal to previous tag's major version, then it's only needed to bump version's minor part by 1
        VERSION=$(bump_minor)
    fi
# on prod an verify environments app should be already built and tagged, so we use existing latest tag
elif [ ${ENV} = "prod" ] || [ ${ENV} = "verify" ]
then
    VERSION=${PREV_TAG}
# on staging and sandbox environments we mark builds with branch name and commit for easier recognition
else
    VERSION=${BRANCH_NAME}"-"${COMMIT_HASH}
fi

echo ${VERSION}