## Manual Setup
* `npm install` will install local dependencies
* `npm install -g bower jshint gulp tsd typescript-formatter bower-installer` to install global dependencies
* Copy `homepage/config/localSettings.example.js` to your own copy of `localSettings.js` and override any settings from localSettings.base.js
  * Set port if you want to override the default port 8111
  * Other settings are optional

    The file should look something like this:
``` javascript
    var baseLocalSettings = require('./localsettings.base'),
        localSettings = baseLocalSettings.extendSettings({
            port: 8111
        });

    exports.localSettings = localSettings;
```

* To Start the server and watch files:
  * `npm run dev` to start the server in development mode
* To run in release mode:
  * `npm start`

Release mode will minify and obfuscate front end files.

## Access Homepage
Open http://localhost:8111 in your browser

## Deployment
* Execute `npm run build` to build files for release.
