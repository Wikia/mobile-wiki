[![Dependency Status](https://david-dm.org/Wikia/mercury.svg)](https://david-dm.org/Wikia/mercury)
[![devDependency Status](https://david-dm.org/Wikia/mercury/dev-status.svg)](https://david-dm.org/Wikia/mercury#info=devDependencies)

## Setup
To begin your journey with Mercury all you need to do is:

1. download repo
2. use `npm run setup`
3. use `npm run dev`
4. start developing

For most cases you don't need to modify your `localSettings.js`, but if you do read [localSettings](#localSettings).

If you are using Mercury on your local machine, Ember-CLI needs to be installed, you can do this using `npm run setup-for-local`.

More available scripts are listed [below](#Scripts)


## Scripts
* `npm run setup` - install all dependencies, including node modules and bower components
* `npm run setup-for-local` - install ember globally (**only on local machine**)
* `npm run build-dev` - build files for dev environment
* `npm run build` - build files for prod environment
* `npm run start` - run built application (**require application to be build first**)
* `npm run dev` - build, run application and watch files
* `npm run test` - run test-front and test-server (**require application to be build first**)
* `npm run linter` - run ESLint on all js files
* `npm run clean` - remove all dependencies, clean the cache, remove build directory

## localSettings
`server/config/localSettings` is main configuration structure. All application settings should be stored there.
Config files are loaded in the following order (next extending a previous one):
 * `localSettings.base.js` - configuration for production environment - used on production, testing and staging
 * `localSettings.dev.js` - configuration for development environment - used on devboxes
 * `localSettings.js` - your local overrides
 
Some tips if you develop outside of devbox:
 * The devboxDomain must have your devbox name (without the dev- prefix) in it
 * If you want to test with consul, use `mediawikiDomain: 'consul.service.sjc-dev.consul'` or `mediawikiDomain: 'consul.service.poz-dev.consul'`

## Access Mercury
### Devbox environment
Open http://muppet.yourname.wikia-dev.com/wiki/Kermit from mobile device or while emulating it in desktop browser.
Or use `curl -H "Host:muppet.yourname.wikia-dev.com" "http://dev-yourname:7000/wiki/Kermit"`

### Local environment
Open http://muppet.127.0.0.1.xip.io:7000/wiki/Kermit

## [Release procedure](https://one.wikia-inc.com/wiki/Mercury/Release)

## [CHANGELOG](https://github.com/Wikia/mercury/blob/dev/CHANGELOG.md)

## Unit tests
To run the unit tests run `npm test` in your terminal.

## Updating translations
Localization is handled by [i18next](http://i18next.com/) JavaScript library and [CrowdIn](https://crowdin.com/) service. i18next is a part (module) of the Mercury and loads files from `front/common/public/locales` directory. CrowdIn is an external service which is responsible only for providing translations for the keys' values from the source file `front/common/public/locales/en/<namespace>.json`. Wikia has its own CrowdIn client which is already installed on your dev-box.

### Uploading new keys/updating key values in the source file
If during the development process you've added new keys to the `front/common/public/locales/en/<namespace>.json` file (the source file), then you have to upload it to CrowdIn to enable the translators to work on the other languages. The same applies if you've changed the values of the existing keys in the source file, as the corresponding values in other languages are being invalidated.
* go to your dev-box and clone the Mercury project (or just upload the `crowdin.conf` file, but this approach needs more flirting with the configuration, manual updating and command line switches → not recommended)
* checkout the branch with the desired changes (or just upload the new source file)
* from the project root directory run `crowdin upload`

### Checking the translation status
* from the project root directory run `crowdin translation-status`
* you can also go to [the project's web page](https://crowdin.com/project/mercury) (more info on access on [Internal](https://one.wikia-inc.com/wiki/Crowdin))

### Downloading the translations
* to simply pull the localization files run `crowdin download` from the project's root directory
* be aware that you can use command line switches, few of them control git:
    * `-c` checkout a new branch with a default name and commit the changes (recommended)
    * `-b` change the default branch name (which is set to `i18n-update` in [`crowdin/main.conf`](https://github.com/Wikia/mercury/blob/dev/crowdin/main.conf#L3))
    * `-m` add a message to the commit
    * `-p` push the branch to GitHub

More details can be found in `README.rst` in [the i18n-tools repository](https://github.com/Wikia/i18n-tools).

If the translations are downloaded and ready, you can merge in `dev` to the `i18n-update` branch (or however you've named it), take a look at the outcome, fix bugs/conflicts if any and issue a pull request.
