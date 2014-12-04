## release-18 (2014-12-04% 17:05)
* [HG-427](https://wikia-inc.atlassian.net/browse/HG-427) Use ellipsis for menu items
* trailing-whitespace-fix: Removed trailing whitespace which was causing TS warning
* [HG-225](https://wikia-inc.atlassian.net/browse/HG-225) Add caching headers for static assets
* Add-X-Served-by-header: serve X-Served-By header to responses from Mercury app
* [HG-435](https://wikia-inc.atlassian.net/browse/HG-435) Fix linked-gallery image height
* [HG-433](https://wikia-inc.atlassian.net/browse/HG-433) Fixed lazy loading in horizontal galleries
* [HG-383](https://wikia-inc.atlassian.net/browse/HG-383) All chevrons are rotating properly now
* [HG-325](https://wikia-inc.atlassian.net/browse/HG-325) Display "A Wikia Contributor" instead of IP in comments
* [HG-372](https://wikia-inc.atlassian.net/browse/HG-372) SearchSuggestions should not be called with less than 3 letters
* quantcast-segment: Fix tests (aka 99th commit for 2 line change)
* quantcast-segment: Add segment label to QuantCast tracking pixel
* [HG-312](https://wikia-inc.atlassian.net/browse/HG-312) Sanitize size of Ooyala videos
* [HG-416](https://wikia-inc.atlassian.net/browse/HG-416) Fix galleries in ADB
* Release-Readme: Release readme
* [HG-331](https://wikia-inc.atlassian.net/browse/HG-331) Fix for clicking a link in figcaption defect
* [HG-423](https://wikia-inc.atlassian.net/browse/HG-423) Locking versions in package.json is simplier and is as safe
* [HG-365](https://wikia-inc.atlassian.net/browse/HG-365) Handle tables with article content differently
* [HG-424](https://wikia-inc.atlassian.net/browse/HG-424) Removed SideNavController and code that was trying to access it
* [HG-239](https://wikia-inc.atlassian.net/browse/HG-239) Added coverate command
* [HG-416](https://wikia-inc.atlassian.net/browse/HG-416) Fix linked images being stretched in ADB\n
## release-17 (2014-12-01 11:46)
* fix-zindexes: Little bit of z-index cleanups for lightbox
* PR-412-quick-fix: Quick fix for #412
* [HG-408](https://wikia-inc.atlassian.net/browse/HG-408) Improve click responsiveness around the application
* [HG-418](https://wikia-inc.atlassian.net/browse/HG-418) Various fixes for linked images in Mercury
* update-deps: Updating server side dependencies
* [HG-281](https://wikia-inc.atlassian.net/browse/HG-281) Enable minimal-ui for iOS 7.1
* fix-headroom-chevron-conflict: Use proper z-index for site-head
* [HG-415](https://wikia-inc.atlassian.net/browse/HG-415) Smart banner's close button wider and easier to tap
* [HG-411](https://wikia-inc.atlassian.net/browse/HG-411) Fix smart banner styling for Android native browser
* [HG-309](https://wikia-inc.atlassian.net/browse/HG-309) Use click event to close a lightbox instead of hammer tap
* [HG-355](https://wikia-inc.atlassian.net/browse/HG-355) Extract side-nav from site-head
* [HG-205](https://wikia-inc.atlassian.net/browse/HG-205) Simplify server code, make it always return full ember app
* [HG-221](https://wikia-inc.atlassian.net/browse/HG-221) WikiaMap component and Map in Lightobox
* Fixes-for-dev-environment: Fixes for dev environment
* [HG-328](https://wikia-inc.atlassian.net/browse/HG-328)active pseudo class to login anchor in site head
* [HG-221](https://wikia-inc.atlassian.net/browse/HG-221) Hg 221 Scaling Map Iframe To Viewport Size
* reject-when-mw-request-failed: Reject when MediaWiki request failed
* [HG-221](https://wikia-inc.atlassian.net/browse/HG-221) Styling fixes for WikiaMap component

## release-16 (2014-11-25 13:40)
* Dont-mark-people-with-cookie: Don't automatically mark people with useskin=mercury

## release-15 (2014-11-25 13:07)
* revert-394-revert-393-Use-useskin-mercury: Revert "Revert "change cookie to useskin=mercury""
* Dont-just-kill-the-server: We should not just kill the server out of the sudden
* revert-393-Use-useskin-mercury: Revert "change cookie to useskin=mercury"
* Use-useskin-mercury: change cookie to useskin=mercury
* Restart-worker-less-often: Node is stable now, lets test if we don't restart it that often
* Simplify-Mediawiki-fetch: Wreck can parse json on it's own
* One-worker-by-default: One worker should be enough for development

## release-14 (2014-11-21 22:30)
* [HG-376](https://wikia-inc.atlassian.net/browse/HG-376) socket hang up issue

## release-13 (2014-11-21 17:05)
* Safer-error-code: default to 500 error if non is provided
* Dont-assume-that-json-is-valid: try catch for JSON.parse in MediaWiki.ts
* [HG-346](https://wikia-inc.atlassian.net/browse/HG-346) Clicking a link in a lightbox caption does not close the lightbox
* Add-changelog: add changelog, and script to generate it semi automatically

## release-12
* [HG-374](https://wikia-inc.atlassian.net/browse/HG-374) Send all GA variables to all accounts

## release-11
* [HG-359](https://wikia-inc.atlassian.net/browse/HG-359) Updated translations
* [HG-367](https://wikia-inc.atlassian.net/browse/HG-367) Update vignette to 1.0.1
* [HG-370](https://wikia-inc.atlassian.net/browse/HG-370) MW serves error with content which should be parsed

## release-10
* [HG-370](https://wikia-inc.atlassian.net/browse/HG-370) Add more response logging in MediaWiki.fetch method
* Fix-close-button-color: Add fill to css, as it got removed from svg

## release-9
* [HG-355](https://wikia-inc.atlassian.net/browse/HG-355) Semi-transparency missing when side menu is open
* [HG-359](https://wikia-inc.atlassian.net/browse/HG-359) Fallback to English if translation is not found
* [HG-110](https://wikia-inc.atlassian.net/browse/HG-110) Custom smart banner
* [HG-252](https://wikia-inc.atlassian.net/browse/HG-252) Add chrevron to the import; Remove &
* [HG-339](https://wikia-inc.atlassian.net/browse/HG-339) Use correct version of FastClick
* [HG-339](https://nwikia-inc.atlassian.net/browse/HG-339) Fix transition freezes on iOS8
* [HG-353](https://wikia-inc.atlassian.net/browse/HG-353) Use correct version of Vignette
* [HG-332](https://wikia-inc.atlassian.net/browse/HG-332) Linked images
* [HG-352](https://wikia-inc.atlassian.net/browse/HG-352) Fix table display bugs
* [HG-336](https://wikia-inc.atlassian.net/browse/HG-336) Validate articleId on getComments
* fix-master-deps: Glob was not properly version locked and a minor change introduced a
* [HG-252](https://wikia-inc.atlassian.net/browse/HG-252) Toggle comments chevron 
* [HG-341](https://wikia-inc.atlassian.net/browse/HG-341) Don't lazyLoad images without url

## release-8
* use-shrinkwrap-for-gulp-task: use npm-shrinkwrap
* [HG-334](https://wikia-inc.atlassian.net/browse/HG-334) Event to track mobile sessions in Mercury
* Remove-clean-task: faster build
* Update-deps: Update deps
* [HG-324](https://wikia-inc.atlassian.net/browse/HG-324) remove ellipsis in footer, make it slightly smaller
* [HG-333](https://wikia-inc.atlassian.net/browse/HG-333) Use the qParam syntax for article requests
* Add-Travis: add travis slack notification
* Video-fixes: don't use such a common name for class,
* [HG-323](https://wikia-inc.atlassian.net/browse/HG-323) fix top nav on default browsers on Android 4.1
* [HG-326](https://wikia-inc.atlassian.net/browse/HG-326) Send all wikis' events to special GA account
* [HG-290](https://wikia-inc.atlassian.net/browse/HG-290) Fix table issues
* [HG-325](https://wikia-inc.atlassian.net/browse/HG-325) Use alias for anon IP addresses
* [HG-330](https://wikia-inc.atlassian.net/browse/HG-330) Always show caption in lightbox
* ad-context: Make the AdContext available as soon as it is set
* [HG-317](https://wikia-inc.atlassian.net/browse/HG-317) Additional custom vars for GA
* [HG-324](https://wikia-inc.atlassian.net/browse/HG-324) Use ellipsis for long lightbox captions
* [HG-321](https://wikia-inc.atlassian.net/browse/HG-321) Renamed host to wiki; Added refferer to logging

## release-7
* [HG-316](https://wikia-inc.atlassian.net/browse/HG-316) Center all ad-slots horizontally
* fixing-image-tapping: Fixing image tapping
* [HG-250](https://wikia-inc.atlassian.net/browse/HG-250) Add timestamps to comments
* [HG-286](https://wikia-inc.atlassian.net/browse/HG-286) Added elipsis to the figcaption as well
* [HG-269](https://wikia-inc.atlassian.net/browse/HG-269) Smart resizing for Ooyala player
* [HG-303](https://wikia-inc.atlassian.net/browse/HG-303) Unify Comscore and Quantcast requests
* [HG-286](https://wikia-inc.atlassian.net/browse/HG-286) Use ellipsis for video captions
* [HG-245](https://wikia-inc.atlassian.net/browse/HG-245) Fix z-indices and increase tap space for lightbox close button
* update-ember: Update Ember version to 1.8.1
* [HG-231](https://wikia-inc.atlassian.net/browse/HG-231) Use thumbnailer as external module
* i18n: Add other locales from CrowdIn
* [HG-249](https://wikia-inc.atlassian.net/browse/HG-249) Hg 249
* [HG-291](https://wikia-inc.atlassian.net/browse/HG-291) Removed explicit line-height on article-content
* npm-run-test-fix: Clean before building for tests
* [HG-212](https://wikia-inc.atlassian.net/browse/HG-212) Remove Mercury cookie for full site page
* [HG-299](https://wikia-inc.atlassian.net/browse/HG-299) Remove article dependency on basePath
* [HG-302](https://wikia-inc.atlassian.net/browse/HG-302) Track page views for all GA properties
* small-video-fix: don't display duration if it is not available
* move-new-relic-back: Move New relic back

## release-6
* [HG-198](https://wikia-inc.atlassian.net/browse/HG-198) top bar slides when scrolling
* [HG-301](https://wikia-inc.atlassian.net/browse/HG-301) Use correct action param when tracing GA
* no-shrink: Check if shrinkwrap is the reason for broken build
* [HG-129](https://wikia-inc.atlassian.net/browse/HG-129) Tracker unit tests
* [HG-251](https://wikia-inc.atlassian.net/browse/HG-251) Add video duration and view count
* [HG-293](https://wikia-inc.atlassian.net/browse/HG-293) Hg 293 bugfix
* [HG-279](https://wikia-inc.atlassian.net/browse/HG-279) Fix bug with displayed "Next page" button in ArticleComments component
* [HG-296](https://wikia-inc.atlassian.net/browse/HG-296) Center mobile leaderboard ad
* [HG-258](https://wikia-inc.atlassian.net/browse/HG-258) Fire tracking event for Read more
* [HG-270](https://wikia-inc.atlassian.net/browse/HG-270) Videos from Ooyala on Android 4.1 & 4.2, iOS 7
* [HG-293](https://wikia-inc.atlassian.net/browse/HG-293) Integrate FastClick and add active state to side nav button
* move-new-relic: Moved NewRelic to server.ts
* [HG-284](https://wikia-inc.atlassian.net/browse/HG-284) Fixed lightbox close button for Android browser
* update-deps: update deps, most importantly let's get back to ember official build
* GA: Fixed syntax error in tracking
* fix-new-relic: new relic should be first
