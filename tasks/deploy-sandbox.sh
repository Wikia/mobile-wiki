#!/usr/bin/env bash

git diff-index --quiet HEAD --
CHANGES=$?

if [ $CHANGES -ne 0 ]; then
    echo "There are uncommited changes"
fi
