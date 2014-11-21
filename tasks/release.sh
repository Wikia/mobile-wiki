#!/bin/sh

SCRIPT_PATH=$(dirname `which $0`)
OLD=$(git branch --remote | grep 'release-' | sed 's/.*-//' | sort -gr | head -1)
NEW=$((OLD+1))
CHANGELOG=CHANGELOG.md
CURRENTBRANCH=$(git branch | grep '*' | sed 's/* //')
DATE=`date -u '+%F% %H:%M'`
RELEASEHEADER='## release-'$NEW' ('$DATE')'

if [ "$CURRENTBRANCH" != "master" ]; then
	echo "You are not on master branch do you want to continue? [y/N]"
	read -e

	if [ "$REPLY" != "y" ]; then
		echo "Bye"
		exit 1
	fi
fi

CHANGE=$($SCRIPT_PATH/changelog.sh $OLD)

if [ "$CHANGE" == "" ]; then
	CHANGE='* Only minor fixes'
fi

echo 'Summary:'
echo $RELEASEHEADER
echo "$CHANGE\n"

echo "Commit and push? [y/N]"
read -e

if [ "$REPLY" == "y" ] || [ "$REPLY" == "Y" ]; then
	TMP=changelog.$RANDOM

	#prepend the changelog
	echo "$CHANGE\n" | cat - $CHANGELOG > $TMP
	mv $TMP $CHANGELOG

	#prepend release header
	echo $RELEASEHEADER | cat - $CHANGELOG > $TMP
	mv $TMP $CHANGELOG

	git add $CHANGELOG
	git commit $CHANGELOG -m 'Changelog: release-'$NEW
	git branch release-$NEW $CURRENTBRANCH

	echo 'git push -u origin release-'$NEW
	git push -u origin release-$NEW
fi
