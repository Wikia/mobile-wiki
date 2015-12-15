import Resolver from './resolver';
import loadInitializers from './load-initializers';

const App = Ember.Application.extend({
	// We specify a rootElement, otherwise Ember appends to the <body> element and Google PageSpeed thinks we are
	// putting blocking scripts before our content
	rootElement: '#ember-container',
	modulePrefix: 'main',
	Resolver
});

window.emberHammerOptions = {
	hammerOptions: {
		// we are using fastclick as this is advised by ember-hammer lib
		ignoreEvents: [],
		swipe_velocity: 0.1,
		pan_threshold: 1
	}
};

loadInitializers(App, 'main');

export default App;
