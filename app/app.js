import './utils/polyfills';
import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

// to save kb we removed ember-cli-shims but in some places we still 'import Ember from 'ember'
// to support it we re-exeport global Ember below
// This can be removed when ember-cli-shims is officially sunset
/* global mefine */
/* eslint prefer-arrow-callback:0 */
mefine('ember', function () {
	return Ember;
});

const App = Application.extend({
	// We specify a rootElement, otherwise Ember appends to the <body> element and Google PageSpeed thinks we are
	// putting blocking scripts before our content
	rootElement: '#ember-container',
	modulePrefix: config.modulePrefix,
	podModulePrefix: config.podModulePrefix,
	Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
