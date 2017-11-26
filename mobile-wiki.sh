#!/usr/bin/env bash

docker run --rm -it -v "$(pwd)":/app -w /app -p 7001:7001 artifactory.wikia-inc.com/mobile-wiki-dev:0.0.1 sh -c "$*"