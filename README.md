## Overview
Mobile Wiki is an application built on top of [Ember](https://emberjs.com/) and [Ember FastBoot](https://ember-fastboot.com/). This combination allows us serve server side rendered application to end client (The same code is executed on frontend and backend).

## Setup
To begin your journey with Mobile Wiki all you need to do is:

1. On devboxes, the repo is already downloaded. `cd /usr/wikia/mobile-wiki`
1. Use `npm run setup`
1. Use `npm run dev`
1. Start developing

It's recommended to host mobile-wiki application on your devbox machine (make sure [`mobileWikiDev` role](https://github.com/Wikia/chef-repo/blob/master/roles/mobileWikiDev.json) is enabled). This setup solves many problems like dependencies, cross-domain scripting, etc.
Development on local machine isn't tested. If you make that happen, please add "how to" here.

More available scripts are listed [here](#scripts)

## Access Mobile Wiki
### Devbox environment
Open http://muppet.yourname.wikia-dev.pl/wiki/Kermit from mobile device or while emulating it in desktop browser.
Or use `curl -H "Host:muppet.yourname.wikia-dev.pl" "http://dev-yourname:7001/wiki/Kermit"`

## Scripts
* `npm run setup` - install all dependencies, including node modules and bower components
* `npm run build` - build files for dev environment
* `npm run build-prod` - build files for prod environment
* `npm run fastboot-server` - run built application (**requires application to be build first**)
* `npm run dev` - build, run application and watch files
* `npm run test` - run tests
* `npm run linter` - run ESLint on all js files
* `npm run clean` - remove all dependencies and build directory
* `npm run clean-deep` - remove all dependencies, remove build directory and clean the cache
* `npm run svgo` - optimize all SVG files in the repository (check out `tasks/optimize-svg.sh` for details and configuration)
* (Experimental) `npm run fastboot-debug` - build and run application in debugging mode. Server side code can be interrupted by debuggers.

## Settings

Mobile Wiki application currently supports two types of configuration.
* configurations computed at build time `config/environment.js`
* runtime configuration `app/instance-initializers/config.js` which has access to environment variables

Some tips if you develop outside of devbox:
 * The devboxDomain must have your devbox name (without the dev- prefix) in it
 * If you want to test with consul, use `mediawikiDomain: 'consul.service.sjc-dev.consul'` or `mediawikiDomain: 'consul.service.poz-dev.consul'`

## See also

### [CHANGELOG](https://github.com/Wikia/mobile-wiki/releases)

### [Tasks](https://github.com/Wikia/mobile-wiki/blob/dev/tasks/README.md)

### [Mercury space - Confluence](https://wikia-inc.atlassian.net/wiki/display/MER/Mercury) - Legacy documentation created before Mercury and Mobile Wiki split

### [How to update translations](https://github.com/Wikia/mobile-wiki/blob/dev/crowdin/README.md)

### [Troubleshooting](https://github.com/Wikia/mobile-wiki/blob/dev/TROUBLESHOOTING.md)
