#!/bin/sh

if [ "$1" != "" ]; then
  FROM=origin/$1
else
  FROM=origin/dev
fi

if [ "$2" != "" ]; then
  TO=origin/$2
else
  TO=origin/master
fi

git --no-pager log $TO..$FROM --merges --pretty=format:'* %s: %b' |
grep 'Merge pull' |
sed -e 's/* .*from Wikia\//* /' \
    -e 's/^* \([A-Z]\{2,5\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
	-e 's/).*:/)/' |
grep -vi 'release-'

