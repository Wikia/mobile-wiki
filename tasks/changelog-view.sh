#!/usr/bin/env bash

# This task triggers following jobs on Jenkins
# http://jenkins.wikia-prod:8080/view/X-Wing/job/notify-weekly-release-update
# http://jenkins.wikia-prod:8080/view/X-Wing/job/update-github-changelog/

while getopts ":f:t:ug" opt; do
	case $opt in
		f)
			FROM=$OPTARG
			;;
		t)
			TO=$OPTARG
			;;
		u)
			UPDATE=true
			;;
		g)
			GITHUB=true
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


CHANGELOG=$(git --no-pager log $FROM..$TO --merges --pretty=tformat:'* %s: %b' |
grep 'Merge pull' |
grep -vi 'from Wikia/release-[0-9]\{1,\}:' |
sed -e 's/* .*from Wikia\//* /' \
-e 's/^* \([A-Z]\{2,8\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
-e 's/).*:/)/')


if [ "$UPDATE" = true ]
then
	echo "POSTING TO #WEEKLY-RELEASE-UPDATE CHANNEL..."
	curl -X POST http://jenkins.wikia-prod:8080/view/X-Wing/job/notify-weekly-release-update/buildWithParameters -d "text=$CHANGELOG"

	RELEASE_ID=$(curl -v --silent "https://api.github.com/repos/Wikia/mercury/releases/tags/${TO}" 2>&1 | grep id -m 1 | grep -E -o '\d+')
fi

if [ "$GITHUB" = true ]
then
	echo "POSTING TO ${TO} ON GITHUB..."
	curl -X POST \
		http://jenkins.wikia-prod:8080/view/X-Wing/job/update-github-changelog/buildWithParameters \
		-d "text=$CHANGELOG&tag=$RELEASE_ID"
fi

git --no-pager log $FROM..$TO --merges --pretty=tformat:'* %s: %b' |
grep 'Merge pull' |
grep -vi 'from Wikia/release-[0-9]\{1,\}:' |
sed -e 's/* .*from Wikia\//* /' \
-e 's/^* \([A-Z]\{2,8\}-[0-9]*\)/* [\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
-e 's/).*:/)/'
