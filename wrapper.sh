#!/usr/bin/env bash

set -Eeo pipefail

git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf ssh://git@github.com/

exec "$@"