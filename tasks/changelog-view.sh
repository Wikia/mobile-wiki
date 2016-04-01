#!/usr/bin/env bash

# Set variables
while getopts ":f:t:" opt; do
	case $opt in
		f)
			FROM=$OPTARG
			;;
		t)
			TO=$OPTARG
			;;
		\?)
			echo "Invalid option: -$OPTARG"
			exit 1
			;;
		:)
			echo "Option -$OPTARG requires an argument."
			exit 1
			;;
	esac
done

if [ -z "$FROM" ]
then
	FROM=$(git tag -l | sed 's/^.\{8\}//' | sort -nr | head -2 | tail -1)
	FROM="release-"$FROM
fi

if [ -z "$TO" ]
then
	TO=$(git tag -l | sed 's/^.\{8\}//' | sort -nr | head -1)
	TO="release-"$TO
fi

git --no-pager log $FROM..$TO --merges --pretty=tformat:'* %s: %b' |
grep 'Merge pull' |
grep -vi 'from Wikia/release-[0-9]\{1,\}:' |
sed -e 's/* .*from Wikia\//* /' \
-e 's/^* \([A-Z]\{2,8\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
-e 's/).*:/)/'

