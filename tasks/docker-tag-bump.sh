#!/bin/sh

# usage ./tag-bump <tag>

PREV_TAG=$1 # eg. 34.001

MAJOR_VERSION=$(echo "$PREV_TAG" | cut -d . -f 1) # 34
MINOR_VERSION=$(echo "$PREV_TAG" | cut -d . -f 2) # 001

echo $((MAJOR_VERSION+1))"."$(printf '%0.3d\n' ${MINOR_VERSION}) # 35.001
