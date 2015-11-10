/**
 * Adds browser-sync script to the page
 */

/* tslint:disable:quotemark */

document.write(
    "<script async src='//HOST:3000/browser-sync/browser-sync-client.js'><\/script>"
        .replace(/HOST/g, location.hostname)
);
