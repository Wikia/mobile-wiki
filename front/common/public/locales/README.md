## Design System i18n messages
Design system messages are stored centrally for all apps in https://github.com/Wikia/design-system-i18n repo.

Those messages are pulled to Mercury as npm dependency on the setup phase (`npm run setup`) and copied with all other translation files to `/www/front/common/locales` on build phase.

To lookup available messages take a look at `node_modules/design-system-i18n/i18n/en/design-system.json`

To use in template just write `{{i18n 'global-footer-example-key' ns='design-system'}}`