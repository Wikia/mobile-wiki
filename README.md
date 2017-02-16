[![Dependency Status](https://david-dm.org/Wikia/mobile-wiki.svg)](https://david-dm.org/Wikia/mobile-wiki)
[![devDependency Status](https://david-dm.org/Wikia/mobile-wiki/dev-status.svg)](https://david-dm.org/Wikia/mobile-wiki#info=devDependencies)

## Setup
To begin your journey with Mobile Wiki all you need to do is:

1. Get the repo:
 1. If you're developing locally, clone the repo and `cd` into the root directory. 
 2. On devboxes, the repos is already downloaded. `cd /usr/wikia/mobile-wiki`
1. Use `npm run setup`
1. Use `npm run dev`
1. Start developing

For most cases you don't need to modify your `settings.js`, but if you do, read [this](#settings) section.

If you are using Mobile Wiki on your local machine, install global dependencies by `npm run setup-for-local`.

More available scripts are listed [here](#scripts)

## Access Mobile Wiki
### Devbox environment
Open http://muppet.yourname.wikia-dev.pl/wiki/Kermit from mobile device or while emulating it in desktop browser.
Or use `curl -H "Host:muppet.yourname.wikia-dev.pl" "http://dev-yourname:7001/wiki/Kermit"`

### Local environment
Open http://muppet.127.0.0.1.xip.io:7001/wiki/Kermit

## Scripts
* `npm run setup` - install all dependencies, including node modules and bower components
* `npm run setup-for-local` - install Ember-CLI, Bower and Gulp globally (**required only on local machine**)
* `npm run build-dev` - build files for dev environment
* `npm run build-prod` - build files for prod environment
* `npm run start` - run built application (**requires application to be build first**)
* `npm run dev` - build, run application and watch files
* `npm run dev-main` - build only the main app and its dependencies, run it and watch files
* `npm run restart` - build ember, run application and watch files (without running gulp's build pipeline)
* `npm run test` - run test-front and test-server (**requires application to be build first**)
* `npm run linter` - run ESLint on all js files
* `npm run clean` - remove all dependencies and build directory
* `npm run clean-deep` - remove all dependencies, remove build directory and clean the cache
* `npm run svgo` - optimize all SVG files in the repository (check out `tasks/optimize-svg.sh` for details and configuration)
* `npm run shrinkwrap` - updates shrinkwrap files which locks the version of dependencies we are using (should be run after [installing or updating a dependency](https://wikia-inc.atlassian.net/wiki/display/MER/Adding+or+updating+NodeJS+packages))

## Settings
`server/config/settings` is main configuration structure. All application settings should be stored there.
Config files are loaded in the following order (next extending a previous one):
 * `settings.base.js` - base configuration
 * `settings.${environment}.js` - configuration for specific environment environment - for production environment e.g. prod, dev, staging
 * `settings.js` - your local overrides

Some tips if you develop outside of devbox:
 * The devboxDomain must have your devbox name (without the dev- prefix) in it
 * If you want to test with consul, use `mediawikiDomain: 'consul.service.sjc-dev.consul'` or `mediawikiDomain: 'consul.service.poz-dev.consul'`

## See also

### [CHANGELOG](https://github.com/Wikia/mobile-wiki/blob/dev/CHANGELOG.md)

### [Tasks](https://github.com/Wikia/mobile-wiki/blob/dev/tasks/README.md)

### [Mercury space - Confluence](https://wikia-inc.atlassian.net/wiki/display/MER/Mercury)

### [How to update translations](https://github.com/Wikia/mercury/blob/dev/crowdin/README.md)

### [How to add or update NodeJS dependencies](https://wikia-inc.atlassian.net/wiki/display/MER/Adding+or+updating+NodeJS+packages)

### [Troubleshooting](https://github.com/Wikia/mobile-wiki/blob/dev/TROUBLESHOOTING.md)
