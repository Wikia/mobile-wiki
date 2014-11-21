#!/bin/sh

SCRIPT_PATH=$(dirname `which $0`)
OLD=$(git branch --remote | grep 'release-' | sed 's/.*-//' | sort -r | head -1)
NEW=$((OLD+1))
CHANGELOG=CHANGELOG.md
CURRENTBRANCH=$(git branch | grep '*' | sed 's/* //')
echo $SCRIPT_PATH
if [ "$CURRENTBRANCH" != "master" ]; then
  echo "You are not on master branch do you want to continue? [y/N]"
  read -e

  if [ "$REPLY" != "y" ]; then
	echo "Aborting"
	exit 1
  fi
fi

#I am sure there is a better way to do this, but this works for now
#TODO: commit this to master and to release as well?
#prepend new line
echo '' | cat - $CHANGELOG > tmp
mv tmp $CHANGELOG

#prepend the changelog
$SCRIPT_PATH/changelog.sh $OLD | cat - $CHANGELOG > tmp
mv tmp $CHANGELOG

#prepend release header
echo '## release-'$NEW | cat - $CHANGELOG > tmp
mv tmp $CHANGELOG

#git add $CHANGELOG
#git commit $CHANGELOG -m 'Changelog: release-'$NEW
#
#git branch release-$NEW master
#git push -u origin release-$NEW


