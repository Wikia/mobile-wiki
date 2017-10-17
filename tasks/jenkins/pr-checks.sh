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
	oldPath=$(pwd)
	md5old=$(md5sum ${dependenciesDir}${1}package.json | sed -e "s#\(^.\{32\}\).*#\1#")
	md5new=$(md5sum .${1}package.json | sed -e "s#\(^.\{32\}\).*#\1#")
	sourceTarget="${dependenciesDir}${1}node_modules .${1}node_modules"

	if [ "$md5new" = "$md5old" ]
	then
		ln -s $sourceTarget
	else
		cp -R $sourceTarget
		updateGit "Setup" pending "updating node modules in .${1}"
		cd ".${1}"
		npm install || error=true
		cd $oldPath

		if [[ ! -z $error ]]
		then
			updateGit "Setup" failure "failed on: updating node modules in .${1}"
			failTests && exit 1
		fi
	fi
}

# $1 - directory
setupBower() {
	oldPath=$(pwd)
	md5old=$(md5sum ${dependenciesDir}${1}bower.json | sed -e "s#\(^.\{32\}\).*#\1#")
	md5new=$(md5sum .${1}bower.json | sed -e "s#\(^.\{32\}\).*#\1#")
	sourceTarget="${dependenciesDir}${1}bower_components .${1}bower_components"

	if [ "$md5new" = "$md5old" ]
	then
		ln -s $sourceTarget
	else
		cp -R $sourceTarget
		updateGit "Setup" pending "updating bower components in .${1}"
		cd ".${1}"
		bower update || error=true
		cd $oldPath

		if [[ ! -z $error ]]
		then
			updateGit "Setup" failure "failed on: updating bower components in .${1}"
			failTests && exit 1
		fi
	fi
}

### Set pending status to all tasks
updateGit "Jenkins job" pending running $BUILD_URL"console"
updateGit "Setup" pending pending
updateGit "Tests" pending pending
updateGit "Linter" pending pending

### Setup - node_modules and bower components
setupNpm "/"

setupBower "/"

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
TEST_PORT=$EXECUTOR_NUMBER npm run test 2>&1 | tee jenkins/tests.log || { error1=true && failJob=true; }
vim -e -s -c ':set bomb' -c ':wq' jenkins/tests.log

if [ -z $error1 ]
then
	updateGit "Tests" success success
	saveState "frontTestsState" "Tests" success success $BUILD_URL"artifact/jenkins/tests.log"
else
	updateGit "Tests" failure failure
	saveState "testsState" "Tests" failure failure $BUILD_URL"artifact/jenkins/tests.log"
fi

### Finish
if [ -z $failJob ]
then
    updateGit "Jenkins job" success finished $BUILD_URL"console"
else
    updateGit "Jenkins job" failure finished $BUILD_URL"console"
    exit 1
fi
