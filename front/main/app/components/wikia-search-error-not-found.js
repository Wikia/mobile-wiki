import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	classNames: ['search-error-not-found'],
	errorPageStringMarkup: computed('erroneousQuery', function () {
		return `<span class="search-error-not-found__query">${this.get('erroneousQuery')}</span>`;
	})
});
