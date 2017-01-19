import Ember from 'ember';
import request from 'ember-ajax/request';

const {Route} = Ember;

export default Route.extend({

	model() {
		return request(M.getImageReviewServiceUrl('/info')).then(({userAllowedToAuditReviews}) => {
			if (!userAllowedToAuditReviews) {
				this.transitionTo('wiki-page', '');
			}
		}, () => {
			this.transitionTo('wiki-page', '');
		});
	},

	afterModel() {
		this.controllerFor('application').set('isLoading', false);
		this.controllerFor('application').set('fullPage', true);
	}

});
