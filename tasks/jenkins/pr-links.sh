#!/usr/bin/env bash

set -x

# $1 - state
sendCurl() {
curl -s \
	-X POST  \
	-H "$githubToken" \
	-d "$1" \
	$githubUrl
}

if [[ ! -z "$buildState" ]]
then
    sendCurl "$buildState"
fi

if [[ ! -z "$testsState" ]]
then
    sendCurl "$testsState"
fi

if [[ ! -z "$linterState" ]]
then
    sendCurl "$linterState"
fi
