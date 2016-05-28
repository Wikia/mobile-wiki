import Ember from 'ember';

const {Controller, inject, $} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],
	errorPageQueryMarkup: Ember.computed('model.erroneousQuery', function () {
		return `<span class="search__query-not-found">${this.get('model.erroneousQuery')}</span>`;
	}),

	actions: {
		onSearchEnter(query) {
			this.set('query', query);
			this.get('model').search(query);
		},

		onErrorPageClick() {
			this.set('query', '');
			this.focusSearchInput();
		}
	},

	focusSearchInput() {
		$('.side-search__input').focus();
	}
});
