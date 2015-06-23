#!/bin/sh

if [ "$1" != "" ]; then
  FROM=$1
else
  FROM=$(git tag -l | sed 's/^.\{8\}//' | sort -nr | head -1)
  FROM="release-"$FROM
fi

if [ "$2" != "" ]; then
  TO=$2
else
  TO=HEAD
fi

git --no-pager log $FROM..$TO --merges --pretty=tformat:'* %s: %b' |
grep 'Merge pull' |
grep -vi 'from Wikia/release-[0-9]\{1,\}:' |
sed -e 's/* .*from Wikia\//* /' \
-e 's/^* \([A-Z]\{2,5\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
-e 's/).*:/)/'

