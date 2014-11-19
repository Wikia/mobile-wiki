#!/bin/sh

if [ "$1" != "" ]; then
  FROM=origin/release-$1
else
  FROM=origin/release-$(git branch --remote | grep 'release-' | sed 's/.*-//' | sort -r | head -1)
fi

if [ "$2" != "" ]; then
  TO=origin/release-$2
else
  TO=master
fi

git --no-pager log $FROM...$TO --merges --pretty=format:'* %s: %b' |
grep 'Merge pull' |
sed -e 's/^.*\(HG-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
	-e 's/* .*from Wikia\//* /' \
	-e 's/).*:/)/'
