#!/bin/bash
# @author Ben Isaacs
# @date 06/25/2014
# Checks if the local settings file exists, and if it doesn't then we use a default file
SCRIPT_NAME=`basename $0`
LOCAL_SETTINGS="config/localSettings.ts"
LOCAL_SETTINGS_DEFAULT="config/localSettings.test.ts"

if [ -e $LOCAL_SETTINGS ];then
	echo $SCRIPT_NAME": "$LOCAL_SETTINGS" found, using it"
else
	echo $SCRIPT_NAME": Couldn't find "$LOCAL_SETTINGS
	if [ -e $LOCAL_SETTINGS_DEFAULT ];then
		echo $SCRIPT_NAME": copying "$LOCAL_SETTINGS_DEFAULT" over"
		cp $LOCAL_SETTINGS_DEFAULT $LOCAL_SETTINGS
	else
		echo $SCRIPT_NAME": Couldn't find "$LOCAL_SETTINGS_DEFAULT"! Did nothing"
	fi
fi