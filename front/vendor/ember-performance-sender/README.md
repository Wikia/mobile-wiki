# Ember Performance Sender
This plugin extends Ember to allow for the collection of performance data during route, view and action events. This plugin is agnostic to where you choose to send your data as you can supply your own meaningful overrides for the plugin's various methods: `log()`, `warn()`, `error()`, and `send()`.

## Getting Started
* To begin, you can install this plugin using Bower: `$ bower install Wikia/ember-performance-sender`
* Next, include the appropriate [distribution](https://github.com/Wikia/ember-performance-sender/tree/master/dist) file in your dependencies, **after Ember.js, but before your Ember application code**
* In your Ember application code, specify an initializer or initialize `EmPerfSender` in an existing initializer:
```js
App.initializer({
  name: 'performance',
  initialize: (container, application) => {
    EmPerfSender.initialize( /* options */);
  }
});
```

## Initialization Options
`EmPerfSender` can be initialized with the following options:

#### `enableAjaxFilter: boolean` (default: false)
If enabled, this will not call send for AJAX traces

#### `enableLogging: boolean` (default: true)
Will turn on verbose logging.

#### `minDuration: number` (default: 50)
Minimum time to call `send()` on

#### `function send(events, metrics): void` (optional)
#### `function error(message): void` (optional)
#### `function log(message): void` (optional)
#### `function warn(message) void` (optional)

## Attribution
The was originally based on a fork of [Caliper's Ember adapter](https://github.com/caliper-io/caliper-ember-dist), but has since been heavily modified. Original library by [Godfrey Chan](https://twitter.com/chancancode).
