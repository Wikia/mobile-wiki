[![renovate-app badge][renovate-badge]][renovate-app]

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

## Overview
Mobile Wiki is an application built on top of [Ember](https://emberjs.com/) and [Ember FastBoot](https://ember-fastboot.com/). This combination allows us serve server side rendered application to end client (The same code is executed on frontend and backend).

## Access Mobile Wiki
### Devbox environment
Open http://muppet.yourname.wikia-dev.pl/wiki/Kermit from mobile device or while emulating it in desktop browser.
Or use `curl -H "Host:muppet.yourname.wikia-dev.pl" "http://dev-yourname:7001/wiki/Kermit"`

## Scripts
* `npm run setup` - install all dependencies
* `npm run build` - build files for dev environment
* `npm run build-prod` - build files for prod environment
* `npm run fastboot-server` - run built application (**requires application to be build first**)
* `npm run dev` - build, run application and watch files
* `npm run test` - run tests
* `npm run linter` - run ESLint on files that are outside ember project
* `npm run stylelint` - run stylelint against all .scss in style folder
* `npm run stylelint -- --fix` - run stylelint and fix all issues that can be automatically fixed
* `npm run clean` - remove all dependencies and build directory
* `npm run svgo` - optimize all SVG files in the repository (check out `tasks/optimize-svg.sh` for details and configuration)
* (Experimental) `npm run fastboot-debug` - build and run application in debugging mode. Server side code can be interrupted by debuggers.

## Settings

Mobile Wiki application currently supports three types of configuration.
* Ember & FastBoot configuration computed at build time `config/environment.js`
* Ember & FastBoot runtime configuration [`app/instance-initializers/config.js`](https://github.com/Wikia/ember-fandom/blob/master/app/instance-initializers/config.js) which has access to environment variables
* Express server configuration (middleware in front of FastBoot server) `config/fastboot-server.js`

Some tips if you develop outside of devbox:
 * The devboxDomain must have your devbox name (without the dev- prefix) in it
 * If you want to test with consul, use `mediawikiDomain: 'consul.service.sjc-dev.consul'` or `mediawikiDomain: 'consul.service.poz-dev.consul'`

## Development

### FastBoot and Server side funtionality
* Check if code is executed on server side: inject fastboot service `fastboot: Ember.inject.service()` and `this.get('fastboot.isFastBoot')`
* Require node package: Whitelist package in `package.json` and `const proc = FastBoot.require('proc')`
* Read request headers: `this.get('fastboot.request.headers')`
* Set response headers: `this.get('fastboot.request.headers').set('x-header', 'value')`
* more on https://ember-fastboot.com/docs/user-guide

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`
* `npm run lint:hbs`

### Shoebox
To improve frontend performance we avoid making the same requests on backend and frontend. [Shoebox](https://ember-fastboot.com/docs/user-guide#the-shoebox) helps us passing data from server to browser. Shoebox serilize data to JSON and puts it as script tag in HTML. In the browser shoebox reads data from HTML and uses it in Ember application.

```javascript
const shoebox = this.get('fastboot.shoebox');

let data;

if (this.get('fastboot.isFastBoot')) {
  data = this.get('model').fetchData();

  shoebox.put('unique-key', data);
} else {
  data = shoebox.retrieve('unique-key');
}

// use your data
```
### Sandboxes
Mobile-wiki is deployed to sandboxes using the [mobile-wiki-deploy-sandbox](http://jenkins.wikia-prod:8080/job/mobile-wiki-deploy-sandbox/) jenkins job.

If you're in the #iris-tech channel, you can also make use of `sandbot` which is a chat bot with the following commands:
- `sandbot status` - current status
- `sandbot taking <name of sandbox>` to reserve one
- `sandbot releasing <name-of sandbox>` to release one

### Devboxes
Mobile-wiki can be run inside Docker using docker-compose. This is as easy as running:

`docker-compose up`

**NOTE**: Make sure MediaWiki docker container is running.

#### Initial setup

Create .env file with the name of the devbox with local user id
(to match the user id inside the container with the one on your dev-box for
proper file permissions):

	```bash
  	echo LOCAL_USER_ID=$(id -u $USER) > .env
	```

You will need a Github token which will be used to fetch packages from private repos.
To get a token go to [your Github settings](https://github.com/settings/tokens) and generate a new token
or use one you have generated earlier. I recommend storing it somewhere safe and just save it per your
ssh session:

```bash
export GITHUB_TOKEN=<YOUR_TOKEN_HERE>
```

**NOTE**: Make sure the token allows access to private repositories - the **repo** (_Full control of private repositories_) should be selected.

Now you need to fetch all dependencies (this can take quite some time for the first time):


```bash
docker run --rm -v `pwd`:/app -e GITHUB_TOKEN="$GITHUB_TOKEN" -e LOCAL_USER_ID=`id -u $USER` artifactory.wikia-inc.com/mobile-wiki/mobile-wiki-devbox:latest npm run setup
```

**NOTE**: If you're using `zsh` or similar shell, make sure that `"` are escaped.

#### (Re)building the docker image
Whenever you add a new global dependency you should rebuild your mobile-wiki container. To do that you need to run:

`docker build -f Dockerfile.devbox -t artifactory.wikia-inc.com/mobile-wiki/mobile-wiki-devbox:latest .`


## See also

### [CHANGELOG](https://github.com/Wikia/mobile-wiki/releases)

### [Tasks](https://github.com/Wikia/mobile-wiki/blob/dev/tasks/README.md)

### [Mercury space - Confluence](https://wikia-inc.atlassian.net/wiki/display/MER/Mercury) - Legacy documentation created before Mercury and Mobile Wiki split

### [How to update translations](https://github.com/Wikia/mobile-wiki/blob/dev/crowdin/README.md)

### [Troubleshooting](https://github.com/Wikia/mobile-wiki/blob/dev/TROUBLESHOOTING.md)

