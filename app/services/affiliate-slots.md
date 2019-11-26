# JSON Files

## `affiliate-slots-units.json`

This file defines all the available affiliate units.

### Structure of a unit

```json
{
  "campaign": "disneyplus",
  "category": "disney",
  "isBig": false,
  "tagline": "Suggested For You",
  "image": "https://vignette.wikia.nocookie.net/central/images/b/bc/Wiki.png/revision/latest?cb=20180423162614",
  "heading": "Fandom",
  "subheading": "Check this out",
  "link": "https://fandom.com",
  "isExternal": false,
  "country": [
    "US",
    "NL"
  ],
  "launchOn": "2018-01-01T00:00:00Z",
  "priority": 3,
  "disableOnSearch": false,
  "disableOnPage": false,
  "onlyOnAndroid": false,
  "onlyOnIOS": false,
  "preferredIndex": 0
},
```

### Important field

* `campaign` - campaing name - this is being used in `affiliate-slots-targeting.json` file and in the taxonomy targeting
* `category` - category name - this is being used in `affiliate-slots-targeting.json` file and in the taxonomy targeting
* `isBig` - defaults to false. If set to true the unit will take over the post search results.
* `tagline` - title heading above the unit
* `isExternal` - defaults to false. If set to true the link is external and should be styled that way.
* `launchOn` - a datetime of when the unit should be available
* `priority` - a numerical priority. The higher the number, the more important unit is.
* `disableOnSearch` - optional property. If set to true the unit is never going to be displayed on Search results.
* `disableOnPage` - optional property. If set to true the unit is never going to be displayed on Pages results.
* `country` - a list of two letter name of the countries (same as one that exists in `Geo` cookie) that the unit should display on
* `onlyOnAndroid` - optional property. If set to true the unit is never going to be displayed on non-Android devices.
* `onlyOnIOS` - optional property. If set to true the unit is never going to be displayed on non-iOS devices.
* `preferredIndex` - optional property. If set, it will override the default slot position in search results.

## `affiliate-slots-targeting.json`

This file defines all the active targeting on the SEARCH RESULTS page.

**NOTE**: Article-level units are driven by taxonomy service.

### Structure of single targeting entry

```json
  {
    "campaign":  "disneyplus",
    "category": "disney",
    "wikiId": [
      1081891,
      123
    ],
    "query": [
      "coffee"
    ]
  },
```

### Fields

**NOTE**: Some the fields are arrays. If the array is empty (`[]`) **OR** it is not present in the object - filtering for that field is ignored. Both `campaign` and `category` are not arrays and are not used for filtering.

* `campaign` - allowed campaign name
* `category` - allowed category name
* `wikiId` - IDs of communities that the unit should display on
* `query` - search queries that the unit should display on
* `vertical` - list of verticals that the unit should display on
