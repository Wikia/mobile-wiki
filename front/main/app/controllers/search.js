import Ember from 'ember';

const {Controller, inject, $} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],
	errorPageQueryMarkup: Ember.computed('model.{erroneousQuery,error}', function () {
		return `<span class="${this.get('model.error')}__query">${this.get('model.erroneousQuery')}</span>`;
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
