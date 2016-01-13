#!/usr/bin/env bash

set -e
set -o pipefail
mkdir jenkins || rm -rf jenkins/* && true

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

### Those tests depends on Mercury Build step
failTests() {
	updateGit "Front tests" failure skipped
	updateGit "Server tests" failure skipped
	updateGit "Linter" failure skipped
	updateGit "Mercury PR Checks" failure finished $BUILD_URL"console"
}

# $1 - directory
setupNpm() {
	oldPath=$(pwd)
	md5old=$(md5sum ../Mercury-UPDATE-node-modules${1}package.json | sed -e "s#\(^.\{32\}\).*#\1#")
	md5new=$(md5sum .${1}package.json | sed -e "s#\(^.\{32\}\).*#\1#")
	sourceTarget="../Mercury-UPDATE-node-modules${1}node_modules .${1}node_modules"

	if [ "$md5new" = "$md5old" ]
	then
		ln -s $sourceTarget
	else
		cp -R $sourceTarget
		updateGit "Mercury build" pending "updating node modules in .${1}"
		cd ".${1}"
		npm install || error=true
		cd $oldPath

		if [[ ! -z $error ]]
		then
			updateGit "Mercury build" failure "failed on: updating node modules in .${1}"
			failTests && exit 1
		fi
	fi
}

# $1 - directory
setupBower() {
	oldPath=$(pwd)
	md5old=$(md5sum ../Mercury-UPDATE-node-modules${1}bower.json | sed -e "s#\(^.\{32\}\).*#\1#")
	md5new=$(md5sum .${1}bower.json | sed -e "s#\(^.\{32\}\).*#\1#")
	sourceTarget="../Mercury-UPDATE-node-modules${1}bower_components .${1}bower_components"

	if [ "$md5new" = "$md5old" ]
	then
		ln -s $sourceTarget
	else
		cp -R $sourceTarget
		updateGit "Mercury build" pending "updating bower components in .${1}"
		cd ".${1}"
		bower install || error=true
		cd $oldPath

		if [[ ! -z $error ]]
		then
			updateGit "Mercury build" failure "failed on: updating bower components in .${1}"
			failTests && exit 1
		fi
	fi
}

### Set pending status to all tasks
updateGit "Mercury PR Checks" pending running $BUILD_URL"console"
updateGit "Mercury build" pending pending
updateGit "Front tests" pending pending
updateGit "Server tests" pending pending
updateGit "Linter" pending pending

### Mercury build - node_modules and bower components
setupNpm "/"
setupNpm "/front/main/"
setupNpm "/server/"

setupBower "/front/auth/"
setupBower "/front/common/"
setupBower "/front/main/"

### Mercury build - building application
updateGit "Mercury build" pending "building application"
npm run build 2>&1 | tee jenkins/mercury-build.log || error3=true
vim -e -s -c ':set bomb' -c ':wq' jenkins/mercury-build.log

if [ -z $error3 ]
then
	updateGit "Mercury build" success success $BUILD_URL"artifact/jenkins/mercury-build.log"
else
	updateGit "Mercury build" failure "failed on: building application" $BUILD_URL"artifact/jenkins/mercury-build.log"
	failTests && exit 1
fi

### Front tests - running
updateGit "Front tests" pending running
npm run test-front 2>&1 | tee jenkins/front-tests.log || error4=true
vim -e -s -c ':set bomb' -c ':wq' jenkins/front-tests.log

if [ -z $error4 ]
then
	updateGit "Front tests" success success $BUILD_URL"artifact/jenkins/front-tests.log"
else
	updateGit "Front tests" failure failure $BUILD_URL"artifact/jenkins/front-tests.log"
fi

### Server tests - running
updateGit "Server tests" pending running
npm run test-server 2>&1 | tee jenkins/server-tests.log || error5=true
vim -e -s -c ':set bomb' -c ':wq' jenkins/server-tests.log

if [ -z $error5 ]
then
	updateGit "Server tests" success success $BUILD_URL"artifact/jenkins/server-tests.log"
else
	updateGit "Server tests" failure failure $BUILD_URL"artifact/jenkins/server-tests.log"
fi

### Linter - running
updateGit "Linter" pending running
npm run linter 2>&1 | tee jenkins/linter.log || error6=true
vim -e -s -c ':set bomb' -c ':wq' jenkins/linter.log

if [ -z $error6 ]
then
	updateGit "Linter" success success $BUILD_URL"artifact/jenkins/linter.log"
else
	updateGit "Linter" failure failure $BUILD_URL"artifact/jenkins/linter.log"
fi

### Finish
updateGit "Mercury PR Checks" success finished $BUILD_URL"console"
