[![Build Status](https://travis-ci.org/Wikia/mercury.svg)](https://travis-ci.org/Wikia/mercury)
[![Dependency Status](https://david-dm.org/Wikia/mercury.svg)](https://david-dm.org/Wikia/mercury)
[![devDependency Status](https://david-dm.org/Wikia/mercury/dev-status.svg)](https://david-dm.org/Wikia/mercury#info=devDependencies)

## Automatic Setup
* Run `./install.sh` after cloning this repo
* Run `npm run dev` to start server and watch files

## Manual Setup
* `npm install` will install local dependencies
* `npm install -g bower jshint gulp forever tsd typescript-formatter bower-installer` to install global dependencies
* `bower install` will install client dependencies
* `tsd update` will update typings folder with ambient files
* Copy `config/localSettings.example.ts` to your own copy of `localSettings.ts` and add your eth0 address as the host, set a port
* run `npm run dev` to start server and watch files

## Setting up hosts
* For any dev box wiki you'd like to use, setup a line in your /etc/hosts, for example:
`127.0.0.1    lastofus.wikia-dev.local`

If you're using macos you can setup dns on your machine to have this automatic:
http://passingcuriosity.com/2013/dnsmasq-dev-osx/

##Live reload
on dev environments livereload server runs that reload your web browser on any change in public folder
you can disable that by running gulp with --nosync parameter

