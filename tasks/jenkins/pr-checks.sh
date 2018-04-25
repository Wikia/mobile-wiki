#!/usr/bin/env bash

set -e
set -x
set -o pipefail
mkdir jenkins || rm -rf jenkins/* && true
echo "githubToken=Authorization: token $GITHUB_TOKEN" > jenkins/params
echo "githubUrl=https://api.github.com/repos/Wikia/mobile-wiki/statuses/$GIT_COMMIT" >> jenkins/params
dependenciesDir="/var/lib/jenkins/workspace/mobile-wiki-update-dependencies"

# $1 - context
# $2 - state
# $3 - description
# $4 - target url
updateGit() {
curl -s \
	-X POST  \
	-H "Authorization: token $GITHUB_TOKEN" \
	-d "{ \"state\": \"$2\", \"description\": \"$3\", \"context\": \"$1\", \"target_url\": \"$4\" }" \
	https://api.github.com/repos/Wikia/mobile-wiki/statuses/$GIT_COMMIT
}

# $1 - state name
# $2 - context
# $3 - state
# $4 - description
# $5 - target url
saveState() {
echo $1="{ \"state\": \"$3\", \"description\": \"$4\", \"context\": \"$2\", \"target_url\": \"$5\" }" >> jenkins/params
}

### Those tests depends on Setup step
failTests() {
	updateGit "Tests" failure skipped
	updateGit "Linter" failure skipped
	updateGit "Jenkins job" failure finished $BUILD_URL"console"
}

# $1 - directory
setupNpm() {
	updateGit "Setup" pending "updating node modules"
	npm install --no-save || error=true

	if [[ ! -z $error ]]
	then
		updateGit "Setup" failure "failed on: updating node modules"
		failTests && exit 1
	fi
}

# $1 - command
greenkeeper() {
	if [[ $branch = "greenkeeper/"* ]]; then
		npm install greenkeeper-lockfile@1 --no-save
		npx greenkeeper-lockfile-${1}
	fi
}

### Set pending status to all tasks
updateGit "Jenkins job" pending running $BUILD_URL"console"
updateGit "Setup" pending pending
updateGit "Tests" pending pending
updateGit "Linter" pending pending
updateGit "Assets size" pending pending

### create new package-lock.json
greenkeeper "update"

### Setup - node_modules
setupNpm

if [ -z $error ]
then
	updateGit "Setup" success success
	saveState "setupState" "Setup" success success $BUILD_URL"artifact/jenkins/setup.log"
else
	updateGit "Setup" failure "failed on: setting up application"
	saveState "setupState" "Setup" failure "failed on: setting up application" $BUILD_URL"artifact/jenkins/setup.log"
	failTests && exit 1
fi

### Tests - running
updateGit "Tests" pending running

COVERAGE=true TEST_PORT=$EXECUTOR_NUMBER npm run test 2>&1 | tee jenkins/tests.log || { error1=true && failJob=true; }
vim -e -s -c ':set bomb' -c ':wq' jenkins/tests.log

if [ -z $error1 ]
then
	updateGit "Tests" success success
	saveState "testsState" "Tests" success success $BUILD_URL"artifact/jenkins/tests.log"
else
	updateGit "Tests" failure failure
	saveState "testsState" "Tests" failure failure $BUILD_URL"artifact/jenkins/tests.log"
fi

### Linter - running
updateGit "Linter" pending running
npm run linter 2>&1 | tee jenkins/linter.log || { error3=true && failJob=true; }
vim -e -s -c ':set bomb' -c ':wq' jenkins/linter.log

if [ -z $error3 ]
then
	updateGit "Linter" success success
	saveState "linterState" "Linter" success success $BUILD_URL"artifact/jenkins/linter.log"
else
	updateGit "Linter" failure failure
	saveState "linterState" "Linter" failure failure $BUILD_URL"artifact/jenkins/linter.log"
fi

### Assets size - running
assetsSizeLogFile="jenkins/assets-size.log"
updateGit "Assets size" pending running
#asd=$'app.css 80\nmobile-wiki.js 360\nvendor.js 610\n'
#while read line ;
#do
#  lineArray=($line)
#  fileNames[$i]=${lineArray[0]}
#  maxFileSizes[$i]=${lineArray[1]}
#  i=$((i + 1))
#done <<< "$asd"
#
#buildprod=$(npm run build-prod)
#while read line ;
#do
#  for (( i=0; i<=${#fileNames[*]}; i++ ))
#  do
#    fileName="$(cut -d'.' -f1 <<<${fileNames[$i]})"
#    fileExt="$(cut -d'.' -f2 <<<${fileNames[$i]})"
#    fileNameRegexp="$fileName(-[a-f0-9]+)?.$fileExt"
#    regexp="dist/mobile-wiki/assets/$fileNameRegexp: ([0-9]+)"
#
#    if [[ $line =~ $regexp ]]
#    then
#      filesize="${BASH_REMATCH[2]}"
#      maxsize=${maxFileSizes[$i]}
#
#      echo "Checking ${fileNames[$i]}" >> $assetsSizeLogFile;
#      echo "Current size: " $filesize "KB" >> $assetsSizeLogFile;
#      echo "Allowed size: " $maxsize "KB" >> $assetsSizeLogFile;
#
#      if [ "$filesize" -gt "$maxsize" ];then
#        echo "Failure. Current file-size is greater than allowed file-size." >> $assetsSizeLogFile;
#        assetsSizeError=true
#        failJob=true
#      else
#        echo "Success! Current file-size is less than allowed file-size." >> $assetsSizeLogFile;
#      fi
#    fi
#  done
#done <<< "$buildprod"

npm run build-prod
cat "dist/mobile-wiki/assets/assetMap.json"

npm run assets-size 2>&1 > /dev/null | tee $assetsSizeLogFile || { assetsSizeError=true && failJob=true; }
vim -e -s -c ':set bomb' -c ':wq' $assetsSizeLogFile

if [ -z $assetsSizeError ]
then
  updateGit "Assets size" success success
  saveState "assetsSizeState" "Assets size" success success $BUILD_URL"artifact/$assetsSizeLogFile"
else
  updateGit "Assets size" failure failure
  saveState "assetsSizeState" "Assets size" failure failure $BUILD_URL"artifact/$assetsSizeLogFile"
fi

### Finish
# upload new package-lock.json
greenkeeper "upload"

if [ -z $failJob ]
then
    updateGit "Jenkins job" success finished $BUILD_URL"console"
else
    updateGit "Jenkins job" failure finished $BUILD_URL"console"
    exit 1
fi
