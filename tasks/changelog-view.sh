#!/bin/sh

if [ "$1" != "" ]; then
  FROM=$1
else
  FROM=origin/dev
fi

if [ "$2" != "" ]; then
  TO=$2
else
  TO=origin/master
fi

git --no-pager log $TO..$FROM --merges --pretty=tformat:'* %s: %b' |
grep 'Merge pull' |
grep -vi 'from Wikia/release-[0-9]\{1,\}:' |
sed -e 's/* .*from Wikia\//* /' \
-e 's/^* \([A-Z]\{2,5\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
-e 's/).*:/)/' |
grep -vi 'release-'

