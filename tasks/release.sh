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

CHANGE=$SCRIPT_PATH/changelog.sh $OLD

if [ "$CHANGE" == "" ]; then
	CHANGE='* Only minor fixes'
fi

echo 'Summary:'
echo $RELEASEHEADER
echo $CHANGE

echo "Commit and push? [Y/n]"
read -e

if [ "$REPLY" == "y" ] || [ "$REPLY" == "Y" ]; then
	#prepend the changelog
	echo $CHANGE'\n' | cat - $CHANGELOG > tmp
	mv tmp $CHANGELOG

	#prepend release header
	echo $RELEASEHEADER | cat - $CHANGELOG > tmp
	mv tmp $CHANGELOG

	git add $CHANGELOG
	git commit $CHANGELOG -m 'Changelog: release-'$NEW
	git branch release-$NEW $CURRENTBRANCH

	echo 'git push -u origin release-'$NEW
	git push -u origin release-$NEW
fi
