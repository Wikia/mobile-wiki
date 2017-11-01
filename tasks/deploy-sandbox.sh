#!/usr/bin/env bash

# usage ./tasks/deploy-sandbox.sh <sandbox-name>

SANDBOX_NAME=$1

if ! [[ $SANDBOX_NAME =~ ^sandbox-[a-z0-9]{2,} ]]; then
    echo "Wrong sandbox-name"
    exit 1
fi

git diff-index --quiet HEAD --
CHANGES=$?

if [ $CHANGES -ne 0 ]; then
    echo "There are uncommitted changes"
    exit 1
fi
