#!/usr/bin/env bash

echo "#######################################################################"
echo "Go to chrome://inspect, click Configure and add dev-you:9229 to targets"
echo "#######################################################################"

# Use LOGNAME env var to make debugger accessible remotely, by default it's 127.0.0.1
node --inspect-brk=dev-${LOGNAME} ./node_modules/.bin/ember serve --no-build
