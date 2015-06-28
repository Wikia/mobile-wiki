#!/bin/bash

while getopts ":r:" opt; do
	case $opt in
		r)
			RELEASE=$OPTARG
			;;
		\?)
			echo "Invalid option: -$OPTARG"
			exit 1
			;;
		:)
			echo "Option -$OPTARG requires an argument"
			exit 1
			;;
	esac
done

if [ -z $RELEASE ]; then
	echo "Please set -r argument, which is RELEASE name like release-xxx, use lower case"
	exit 1
fi

HEADC=$(cat CHANGELOG.md | grep "## "$RELEASE" " | wc -l)

if [ $HEADC -gt 0 ]; then
	RELEASE=$RELEASE" hotfix "$HEADC
fi

./tasks/changelog-view.sh 1> new

WORDC=$(wc -w new | tr -d '[:alpha:][:blank:][:punct:]/-')
DATE=$(date -u +"%Y-%m-%d %H:%M")

if [ $WORDC -gt 0 ]; then
	echo "## "$RELEASE" ("$DATE" UTC)" > temp
	cat new >> temp
	echo "" >> temp
	cat CHANGELOG.md >> temp
	mv temp CHANGELOG.md	
	echo -e "\nChangelog updated with:"
	cat new && echo
else
	echo -e "\nThere are no new commits"
fi

rm new

