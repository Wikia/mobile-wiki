#!/usr/bin/env bash

set -Eeo pipefail

git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf ssh://git@github.com/

# Add local user
# Either use the LOCAL_USER_ID if passed in at runtime or
# fallback

USER_ID=${LOCAL_USER_ID:-9001}

echo "Starting with UID : $USER_ID"
adduser -h /app -s /bin/bash -D -u $USER_ID docker_user
export HOME=/app

exec gosu docker_user "$@"