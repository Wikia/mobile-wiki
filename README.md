[![Dependency Status](https://david-dm.org/Wikia/mercury.svg)](https://david-dm.org/Wikia/mercury)
[![devDependency Status](https://david-dm.org/Wikia/mercury/dev-status.svg)](https://david-dm.org/Wikia/mercury#info=devDependencies)

## Manual Setup
* `npm install` will install dependencies
* `bower update` will install and update client dependencies
* Copy `config/localSettings.example.js` to your own copy of `localSettings.js` and set the `port` and `devboxDomain`.
  * The devboxDomain must have your devbox name (without the dev- prefix) in it.
  * If you want to test with consul, add `mediawikiDomain: 'icache.service.sjc.consul'` to your localSettings
  * If you want to see debug output add `loggers: { console: 'debug' }` to your localSettings

    File should look something like this:
``` javascript
import baseExtendSettingsDev from './localSettings.dev';
import baseExtendSettingsProd from './localSettings.base';

const baseExtendSettings = process.env.WIKIA_ENVIRONMENT === 'dev' ? baseExtendSettingsDev : baseExtendSettingsProd,
	localSettings = baseExtendSettings({
		devboxDomain: 'joe',
		loggers: {
			console: 'debug'
		}
	});

export default localSettings;
```
* Start the server and watch files:
  * `npm run local` If running everything locally (e.g. your laptop)
  * `npm run dev` For hosted environments.  Same as 'local' but includes the --nosync paramter to disable [Live Reload](#live-reload)

## localSettings
`localSettings` is main configuration structure. All application settings should be stored there.
 * `localSettings.base.js` - configuration for production environment - used on production, testing and staging
 * `localSettings.dev.js` - configuration for development environment - used on devboxes - **you should be extending this one for development**

## Access Mercury
Open http://muppet.127.0.0.1.xip.io:7000/wiki/Gonzo in your browser
$ curl -H "Host:muppet.wikia-dev.com" "http://dev-joe:7000/wiki/Gonzo"

##Live reload
In dev environments the livereload plugin is available when the server is started with `npm run local`.  This will reload your web browser on any change to the `front` folder.

You can disable this behavior by running gulp with --nosync parameter, or as noted previously, by starting the server with `npm run dev`.

##[Release procedure](https://one.wikia-inc.com/wiki/Mercury/Release)

##[CHANGELOG](https://github.com/Wikia/mercury/blob/dev/CHANGELOG.md)

## Unit tests

To run the unit tests run `npm test` in your terminal.
To generate the code coverage run `npm run coverage`. The reports will be generated in `tests/coverage` subdirectories.

## Updating dependencies
### Server side
* check for updates or run `npm-check-updates {-u}`
* `npm update`
* test if service runs and serves correct data

## Updating translations
Localization is handled by [i18next](http://i18next.com/) JavaScript library and [CrowdIn](https://crowdin.com/) service. i18next is a part (module) of the Mercury and loads files from `front/locales` directory. CrowdIn is an external service which is responsible only for providing translations for the keys' values from the source file `front/locales/en/<namespace>.json`. Wikia has its own CrowdIn client which is already installed on your dev-box.

### Uploading new keys/updating key values in the source file
If during the development process you've added new keys to the `front/locales/en/<namespace>.json` file (the source file), then you have to upload it to CrowdIn to enable the translators to work on the other languages. The same applies if you've changed the values of the existing keys in the source file, as the corresponding values in other languages are being invalidated.
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
    * `-b` change the default branch name (which is set to `i18n-update` in [`crowdin.conf`](https://github.com/Wikia/mercury/blob/dev/crowdin.conf#L3))
    * `-m` add a message to the commit
    * `-p` push the branch to GitHub

More details can be found in `README.rst` in [the i18n-tools repository](https://github.com/Wikia/i18n-tools).

If the translations are downloaded and ready, you can merge in `dev` to the `i18n-update` branch (or however you've named it), take a look at the outcome, fix bugs/conflicts if any and issue a pull request.

## Testing on devices
### Using IP over the same network
To test on your mobile device, connect both your development machine and your device to the same network. You can then visit Mercury on your device by using your machine's IP address (on OS X, you can get that using `ifconfig`). The URL should look something like: `//muppet.10.10.10.123.xip.io:8000/wiki/Foo`.

## Troubleshooting
### Errors while running `npm run dev`
Sometimes it helps to just delete the npm_modules folder and reinstall.
```
rm -rf node_modules
npm cache clear
npm install
```

### Errors while running `npm install`
#### libsass
So far, we've encountered one error connected to compiling `libsass`. It happened on Ubuntu 12.04 (pretty old version but still a LTS version). The issue was connected to outdated g++ compiler. `libsass` requires version 4.8+ and by default Ubuntu 12.04 has 4.6 to update it go to your terminal and manually install g++-4.8:
`sudo apt-get remove g++-4.6`
`sudo apt-get install g++-4.8`
`sudo ln -s /usr/bin/g++-4.8 /usr/bin/g++`
#### Debian and its nodejs binary
Debian (the issue was found on version: `Debian 3.16.7-ckt4-3 (2015-02-03)`) installs node.js interpreter binary as `nodejs` instead of `node` because of name conflicts with other applications. The `/usr/share/doc/nodejs/README.Debian` reads:
> nodejs command
> --------------
>
> The upstream name for the Node.js interpreter command is "node".
> In Debian the interpreter command has been changed to "nodejs".
>
> This was done to prevent a namespace collision: other commands use the same name in their upstreams, such as ax25-node from the "node" package.
>
> Scripts calling Node.js as a shell command must be changed to instead use the "nodejs" command.
However, changing dependencies scripts does not sound right way. I suggest creating a symlink in `/usr/bin`:
```sh
sudo ln -s /usr/bin/nodejs /usr/bin/node
$ ls /usr/bin/ | grep node
node
node-gyp
nodejs
```
