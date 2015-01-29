#!/bin/sh

if [ "$1" != "" ]; then
  FROM=origin/$1
else
  FROM=origin/release-$(git branch --remote | grep 'release-' | sed 's/.*-//' | sort -gr | head -1)
fi

if [ "$2" != "" ]; then
  TO=origin/$2
else
  TO=master
fi

git --no-pager log $FROM...$TO --merges --pretty=format:'* %s: %b' |
grep 'Merge pull' |
sed -e 's/* .*from Wikia\//* /' \
    -e 's/^* \([A-Z]\{2,3\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
	-e 's/).*:/)/'
