[![Build Status](https://travis-ci.org/Wikia/mercury.svg)](https://travis-ci.org/Wikia/mercury)
[![devDependency Status](https://david-dm.org/Wikia/mercury/dev-status.svg)](https://david-dm.org/Wikia/mercury)

# Wikia Mobile
1. [Getting Started](#getting-started)

## Getting Started
* `npm install` will install local dependencies
* `npm install -g bower jshint gulp forever tsd typescript-formatter bower-installer` to install global dependencies
* `bower install` will install client dependencies
* `tsd update` will update typings folder with ambient files
* alternatively run `./install.sh`
* Copy `config/localSettings.example.ts` to your own copy of `localSettings.ts` and add your eth0 address as the host, set a port
* run npm run-script dev to start server and watch files

##Live reload
on dev environments livereload server runs that reload your web browser on any change in public folder

