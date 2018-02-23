visit-source
===========

JS library that gets stores session referrer in a cookie

## Usage

### Constructor
```
/**
 *
 * @param cookieName - cookie where session referrer is stored
 * @param cookieDomain - cookie domain parameter - for saving cookies
 * @param isSession - flag, based on this value cookie is stored only for current session or lifetime
 */
new VisitSource(cookieName: string, cookieDomain: string, isSession: boolean = true)
```

### ```checkAndStore()```
Check if cookie with referrer is already set and if not store current referrer value.

### ```get()```
Get stored referrer value from cookie

### ```store()```
Stores current referrer value in the cookie

## Example

```
var visitSource = new VisitSource('visitSource', 'wikia.com');
visitSource.checkAndStore();

visitSource.get();
```
