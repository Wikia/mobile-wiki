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

if [[ ! -z "$frontTestsState" ]]
then
    sendCurl "$frontTestsState"
fi

if [[ ! -z "$serverTestsState" ]]
then
    sendCurl "$serverTestsState"
fi

if [[ ! -z "$linterState" ]]
then
    sendCurl "$linterState"
fi
