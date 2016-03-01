## changelog-view.sh
Generate changelog between two commits/branches/tags and displays result in console:

* `./tasks/changelog-view.sh`

Parameters (optional):
* `-f FROM` - (default: last release tag) set begin range
* `-t TO` - (default: current branch HEAD) set end range

NOTE:
* As FROM and TO put remote/branch, commit_sha or tag, i.e. origin/dev, ed84ba5 or release-40.001

## changelog-update.sh
Update existing CHANGELOG.md with changes between two commits/branches/tags:

* `./tasks/changelog-update.sh`

Parameters:
* `-r RELEASE` - (required) set release name, i.e. release-123
* `-f FROM` - (default: last release tag) set begin range
* `-t TO` - (default: current branch HEAD) set end range

NOTE:
* Using release name which already exists will be treated as a hotfix
* As FROM and TO put remote/branch, commit_sha or tag, i.e. origin/dev, ed84ba5 or release-40.001

## deploy.sh
Script performs Deploy Tools commands lock/prep/push for Mercury, App and Config:

* `./tasks/deploy.sh`

Parameters:
* `-e ENVIRONMENT` - (required) environment name i.e. sandbox-mercury, preview, prod, etc.
* `-u USERNAME` - set custom username if it is different than in Wikia environment
* `-m MERCURY` - set mercury branch to push i.e. HG-123
* `-a APP` - set app branch to push i.e. HG-123
* `-c CONFIG` - set config branch to push i.e. HG-123
* `-f` - set to force rebuilding package

## optimize-svg.sh
This script iterates through all SVG files in predefined directories and optimizes them.
Use of `npm run svgo` is recommend to run this script, but you can also invoke it directly: `./tasks/optimize-svg.sh`.

Currently iterated directories:
* `./front/common/public/symbols`
* `./front/main/app/symbols`

If you've added SVGs in different directory please update the script and this README file.
