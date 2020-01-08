import Application from '@ember/application';
import { setupPostQuecast } from '@wikia/post-quecast';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';
import config from './config/environment';
import adSlotBuilder from './services/ads/ad-slot-builder';

if (typeof FastBoot === 'undefined') {
  setupPostQuecast();
}

// to save kb we removed ember-cli-shims but in some places we still 'import Ember from 'ember'
// to support it we re-exeport global Ember below
// This can be removed when ember-cli-shims is officially sunset
/* global define */
/* eslint prefer-arrow-callback:0 */
define('ember', function () {
  return Ember;
});

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
});

App.initializer({
  name: 'mobile-wiki',

  initialize(application) {
    application.register('service:ads/ad-slot-builder', adSlotBuilder, { singleton: false });
  },
});

loadInitializers(App, config.modulePrefix);

export default App;
