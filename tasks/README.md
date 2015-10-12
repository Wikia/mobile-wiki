## changelog-view.sh
You can generate changelog and displays it in console:

* `./tasks/changelog-view.sh` - generate changelog between last release tag and your current branch HEAD
* `./tasks/changelog-view.sh FROM` - generate changelog between FROM and your current branch HEAD
* `./tasks/changelog-view.sh FROM TO` - generate changelog between FROM and TO

As FROM,TO you can put remote/branch, commit_sha or tag, i.e. origin/dev, ed84ba5 or release-40.001

## changelog-update.sh
You can update existing CHANGELOG.md with changes between last release tag and your current branch HEAD:

* `./tasks/changelog-update.sh -r release-xxx` - where xxx is number of release you want to create

NOTE: if you use number which already exists it will treat it as a hotfix

## deploy.sh
Script combines Deploy Tools commands lock/prep/push for Mercury, App and Config:

* `./tasks/deploy.sh -e ENVIRONMENT -u USERNAME -m MERCURY -a APP -c CONFIG` - as user USERNAME push to ENVIRONMENT branches mercury@MERCURY, app@APP and config@CONFIG

Parameters (order is not important):
* `-e ENVIRONMENT` - (required) environment name i.e. sandbox-mercury, preview, prod, etc.
* `-u USERNAME` - (optional) if your username in console is different than you use for login to Wikia environment
* `-m MERCURY` - (optional) mercury branch you want to push i.e. HG-123
* `-a APP` - (optional) app branch you want to push i.e. HG-123
* `-c CONFIG` - (optional) config branch you want to push i.e. HG-123

