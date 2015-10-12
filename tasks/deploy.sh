#!/bin/bash

# Set variables
while getopts ":e:m:a:c:u:" opt; do
	case $opt in
		e)
			ENVIRONMENT=$OPTARG
			;;
		m)
			MERCURY=$OPTARG
			;;
		a)
			APP=$OPTARG
			;;
		c)
			CONFIG=$OPTARG
			;;
		u)
			USERNAME=$OPTARG"@"
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

# Check if ENVIRONMENT is not empty
if [ -z "$ENVIRONMENT" ]
then
	echo "Please set ENVIRONMENT like sandbox-mercury"
	exit 1
fi

# Check if MERCURY is not empty
if [ ! -z "$MERCURY" ]
then
	ssh $USERNAME"deploy-s3" dt -y lock -t mercury:$ENVIRONMENT --release
	ssh $USERNAME"deploy-s3" dt -y prep -e $ENVIRONMENT -a mercury -r mercury@$MERCURY
	ssh $USERNAME"deploy-s3" dt -y push -e $ENVIRONMENT -a mercury
fi

# Check if APP is not empty
if [ ! -z "$APP" ]
then
	BRANCH="-r app@"$APP
fi

# Check if CONFIG is not empty
if [ ! -z "$CONFIG" ]
then
	BRANCH=$BRANCH" -r config@"$CONFIG
fi

# Push APP and CONFIG
if [ ! -z "$BRANCH" ]
then
	ssh $USERNAME"deploy-s3" dt -y lock -t wikia:$ENVIRONMENT --release
	ssh $USERNAME"deploy-s3" dt -y prep -e $ENVIRONMENT -a wikia $BRANCH
	ssh $USERNAME"deploy-s3" dt -y push -e $ENVIRONMENT -a wikia
fi

