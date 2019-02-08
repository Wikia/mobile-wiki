## Console
You can run tests in console in two ways.

The first one is to run it with npm script runner:

1. On devboxes, the repo is already downloaded. `cd /usr/wikia/mobile-wiki`
1. Use `npm run setup`
1. Run `npm run test`

The second one is to run it with ember runner:
1. On devboxes, the repo is already downloaded. `cd /usr/wikia/mobile-wiki`
1. Use `npm run setup`
1. Run `ember t -s`

You can also run just one group of tests with `-m` parameter for example:
`ember t -s -m 'Unit | Module | ads | bill-the-lizard'`

## Browser
Whenever you have a server up for example on your devbox with:
`npm run dev`

You can visit `http://dev-yourname:7001/tests` and use GUI for ember tests runner. You can run all the tests there or just select some.
