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
