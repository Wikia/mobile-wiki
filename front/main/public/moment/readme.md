## Adding new locales for moment

1. Get chosen language file from moment's locale folder and put it here
1. Extend locale file by relative time
1. As long as we are using mefine and mequire, replace in file:
 * All `define` function calls with `mefine`
 * All `require` function calls with `mequire`
1. Go to  `moment-locale` service and add path to translation in `LocalePath` so it can be revved