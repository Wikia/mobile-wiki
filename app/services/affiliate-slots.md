# JSON Files

## `affiliate-slots-units.json`

This file defines all the available affiliate units.

### Structure of a unit

```json
{
  "name": "fandom-com",
  "isBig": false,
  "image": "https://vignette.wikia.nocookie.net/central/images/b/bc/Wiki.png/revision/latest?cb=20180423162614",
  "heading": "Fandom",
  "subheading": "Check this out",
  "link": "https://fandom.com",
  "isExternal": false,
  "priority": 3,
  "disableOnSearch": false,
  "disableOnPage": false,
  "onlyOnAndroid": false,
  "onlyOnIOS": false,
  "preferredIndex": 0
},
```

### Important field

* `name` -  a short description of the unit - this is being used in `affiliate-slots-targeting.json` file
* `isBig` - defaults to false. If set to true the unit will be tke over the post search results.
* `isExternal` - defaults to false. If set to true the link is external and should be styled that way.
* `priority` - a numerical priority. The higher the number, the more important unit is.
* `disableOnSearch` - optional property. If set to true the unit is never going to be displayed on Search results.
* `disableOnPage` - optional property. If set to true the unit is never going to be displayed on Pages results.
* `onlyOnAndroid` - optional property. If set to true the unit is never going to be displayed on non-Android devices.
* `onlyOnIOS` - optional property. If set to true the unit is never going to be displayed on non-iOS devices.
* `preferredIndex` - optional property. If set, it will override the default slot position in search results.

## `affiliate-slots-targeting.json`

This file defines all the active targeting.

### Structure of single targeting entry

```json
  {
    "comment": "Fandom.com test for keiko-test wiki on searching for 'coffee'",
    "unit": [
      "fandom-com",
      "fandom-com2"
    ],
    "wikiId": [
      1081891,
      123
    ],
    "country": [
      "US",
      "NL"
    ],
    "page": [
      "Luke_Skywalker"
    ],
    "query": [
      "coffee"
    ],
    "vertical": [
      "games"
    ]
  },
```

### Fields

**NOTE**: All the fields are arrays. If the array is empty (`[]`) **OR** it is not present in the object - filtering for that field is ignored.

* `comment` - just a way to add comments to JSON; _ignored_
* `unit` - a list of `name`s from `affiliate-slots-units.json` for that unit
* `wikiId` - IDs of communities that the unit should display on
* `country` - two letter name of the country (same as one that exists in `Geo` cookie) that the unit should display on
* `page` - MW article names that the unit should display on
* `query` - search queries that the unit should display on
* `vertical` - list of verticals that the unit should display on

Those are non-array fields for targeting:

* `disableOnSearch` is set to `true` the targeting will be disabled on search; `false` is the default
* `disableOnPage` is set to `true` the targeting will be disabled on article pages; `false` is the default
