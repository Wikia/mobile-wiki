import Ember from 'ember';

const {Route, Logger} = Ember;

export default Route.extend({
	beforeModel() {
		Logger.error('I\'m in main route!');
		this.transitionTo('image-review.index');
	}
})
