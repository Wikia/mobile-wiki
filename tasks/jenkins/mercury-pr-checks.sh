#!/usr/bin/env bash

set -e
set -x
set -o pipefail
mkdir jenkins || rm -rf jenkins/* && true
echo "githubToken=Authorization: token $GITHUB_TOKEN" > jenkins/params
echo "githubUrl=https://api.github.com/repos/Wikia/mercury/statuses/$GIT_COMMIT" >> jenkins/params
dependenciesDir="/var/lib/jenkins/workspace/Mercury-UPDATE-dependencies"

# $1 - context
# $2 - state
# $3 - description
# $4 - target url
updateGit() {
curl -s \
	-X POST  \
	-H "Authorization: token $GITHUB_TOKEN" \
	-d "{ \"state\": \"$2\", \"description\": \"$3\", \"context\": \"$1\", \"target_url\": \"$4\" }" \
	https://api.github.com/repos/Wikia/mercury/statuses/$GIT_COMMIT
}

# $1 - state name
# $2 - context
# $3 - state
# $4 - description
# $5 - target url
saveState() {
echo $1="{ \"state\": \"$3\", \"description\": \"$4\", \"context\": \"$2\", \"target_url\": \"$5\" }" >> jenkins/params
}

### Those tests depends on Build step
failTests() {
	updateGit "Front tests" failure skipped
	updateGit "Server tests" failure skipped
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
		updateGit "Build" pending "updating node modules in .${1}"
		cd ".${1}"
		npm install || error=true
		cd $oldPath

		if [[ ! -z $error ]]
		then
			updateGit "Build" failure "failed on: updating node modules in .${1}"
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
		updateGit "Build" pending "updating bower components in .${1}"
		cd ".${1}"
		bower update || error=true
		cd $oldPath

		if [[ ! -z $error ]]
		then
			updateGit "Build" failure "failed on: updating bower components in .${1}"
			failTests && exit 1
		fi
	fi
}

### Set pending status to all tasks
updateGit "Jenkins job" pending running $BUILD_URL"console"
updateGit "Build" pending pending
updateGit "Front tests" pending pending
updateGit "Server tests" pending pending
updateGit "Linter" pending pending

### Build - node_modules and bower components
setupNpm "/"
setupNpm "/front/main/"
setupNpm "/server/"

setupBower "/front/auth/"
setupBower "/front/common/"
setupBower "/front/main/"

### Build - building application
updateGit "Build" pending "building application"
npm run build-dev 2>&1 | tee jenkins/build.log || error=true
vim -e -s -c ':set bomb' -c ':wq' jenkins/build.log

if [ -z $error ]
then
	updateGit "Build" success success
	saveState "buildState" "Build" success success $BUILD_URL"artifact/jenkins/build.log"
else
	updateGit "Build" failure "failed on: building application"
	saveState "buildState" "Build" failure "failed on: building application" $BUILD_URL"artifact/jenkins/build.log"
	failTests && exit 1
fi

### Front tests - running
updateGit "Front tests" pending running
TEST_PORT=$EXECUTOR_NUMBER npm run test-front 2>&1 | tee jenkins/front-tests.log || { error1=true && failJob=true; }
vim -e -s -c ':set bomb' -c ':wq' jenkins/front-tests.log

if [ -z $error1 ]
then
	updateGit "Front tests" success success
	saveState "frontTestsState" "Front tests" success success $BUILD_URL"artifact/jenkins/front-tests.log"
else
	updateGit "Front tests" failure failure
	saveState "frontTestsState" "Front tests" failure failure $BUILD_URL"artifact/jenkins/front-tests.log"
fi

### Server tests - running
updateGit "Server tests" pending running
npm run test-server 2>&1 | tee jenkins/server-tests.log || { error2=true && failJob=true; }
vim -e -s -c ':set bomb' -c ':wq' jenkins/server-tests.log

if [ -z $error2 ]
then
	updateGit "Server tests" success success
	saveState "serverTestsState" "Server tests" success success $BUILD_URL"artifact/jenkins/server-tests.log"
else
	updateGit "Server tests" failure failure
	saveState "serverTestsState" "Server tests" failure failure $BUILD_URL"artifact/jenkins/server-tests.log"
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

### Finish
if [ -z $failJob ]
then
    updateGit "Jenkins job" success finished $BUILD_URL"console"
else
    updateGit "Jenkins job" failure finished $BUILD_URL"console"
    exit 1
fi
