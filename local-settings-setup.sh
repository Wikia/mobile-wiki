#!/bin/bash
if [ -e config/localSettings.ts ];then
	echo `basename $0`": config/localSettings.ts found, using it"
else
	echo `basename $0` ": Couldn't find localSettings.ts, running cp config/localSettings.dev.ts config/localSettings.ts"
	cp config/localSettings.dev.ts config/localSettings.ts
fi