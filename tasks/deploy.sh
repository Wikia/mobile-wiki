#!/usr/bin/env bash

while getopts ":e:m:a:c:u:f" opt; do
	case $opt in
		e)
			ENVIRONMENT=$OPTARG
			;;
		m)
			MERCURY="-r mercury@$OPTARG"
			;;
		a)
			APP="-r app@$OPTARG"
			;;
		c)
			CONFIG="-r config@$OPTARG"
			;;
		u)
			USERNAME="$OPTARG@"
			;;
		f)
			FORCE="--force"
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
	echo "Please set -e ENVIRONMENT i.e. -e sandbox-mercury"
	exit 1
fi

# Push MERCURY
if [ ! -z "$MERCURY" ]
then
	ssh $USERNAME"deploy-s1" dt -y lock -t mercury:$ENVIRONMENT --release
	ssh $USERNAME"deploy-s1" dt -y prep -e $ENVIRONMENT -a mercury $MERCURY $FORCE
	ssh $USERNAME"deploy-s1" dt -y push -e $ENVIRONMENT -a mercury
fi

# Push APP and/or CONFIG
if [ ! -z "$APP" -o ! -z "$CONFIG" ]
then
	ssh $USERNAME"deploy-s1" dt -y lock -t wikia:$ENVIRONMENT --release
	ssh $USERNAME"deploy-s1" dt -y prep -e $ENVIRONMENT -a wikia $APP $CONFIG $FORCE
	ssh $USERNAME"deploy-s1" dt -y push -e $ENVIRONMENT -a wikia
fi

