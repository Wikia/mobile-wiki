[![Dependency Status](https://david-dm.org/Wikia/mercury.svg)](https://david-dm.org/Wikia/mercury)
[![devDependency Status](https://david-dm.org/Wikia/mercury/dev-status.svg)](https://david-dm.org/Wikia/mercury#info=devDependencies)

## Setup
To begin your journey with Mercury all you need to do is:

1. download repo
1. use `npm run setup`
1. use `npm run dev`
1. start developing

For most cases you don't need to modify your `localSettings.js`, but if you do, read [this](#localsettings) section.

If you are using Mercury on your local machine, install global dependencies by `npm run setup-for-local`.

More available scripts are listed [here](#scripts)

## Access Mercury
### Devbox environment
Open http://muppet.yourname.wikia-dev.com/wiki/Kermit from mobile device or while emulating it in desktop browser.
Or use `curl -H "Host:muppet.yourname.wikia-dev.com" "http://dev-yourname:7000/wiki/Kermit"`

### Local environment
Open http://muppet.127.0.0.1.xip.io:7000/wiki/Kermit

## Scripts
* `npm run setup` - install all dependencies, including node modules and bower components
* `npm run setup-for-local` - install Ember-CLI, Bower and Gulp globally (**required only on local machine**)
* `npm run build-dev` - build files for dev environment
* `npm run build-prod` - build files for prod environment
* `npm run start` - run built application (**requires application to be build first**)
* `npm run dev` - build, run application and watch files
* `npm run test` - run test-front and test-server (**requires application to be build first**)
* `npm run linter` - run ESLint on all js files
* `npm run clean` - remove all dependencies and build directory
* `npm run clean-deep` - remove all dependencies, remove build directory and clean the cache

## localSettings
`server/config/localSettings` is main configuration structure. All application settings should be stored there.
Config files are loaded in the following order (next extending a previous one):
 * `localSettings.base.js` - configuration for production environment - used on production, testing and staging
 * `localSettings.dev.js` - configuration for development environment - used on devboxes
 * `localSettings.js` - your local overrides
 
Some tips if you develop outside of devbox:
 * The devboxDomain must have your devbox name (without the dev- prefix) in it
 * If you want to test with consul, use `mediawikiDomain: 'consul.service.sjc-dev.consul'` or `mediawikiDomain: 'consul.service.poz-dev.consul'`

## See also

### [CHANGELOG](https://github.com/Wikia/mercury/blob/dev/CHANGELOG.md)

### [Tasks](https://github.com/Wikia/mercury/blob/dev/tasks/README.md)

### [Mercury space - Confluence](https://wikia-inc.atlassian.net/wiki/display/MER/Mercury)

### [How to update translations](https://github.com/Wikia/mercury/blob/dev/crowdin/README.md)

### [Troubleshooting](https://github.com/Wikia/mercury/blob/dev/TROUBLESHOOTING.md)
