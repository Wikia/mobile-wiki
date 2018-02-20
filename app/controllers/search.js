import {inject as service} from '@ember/service';
import {equal, alias} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';

export default Controller.extend({
	application: controller(),
	fastboot: service(),
	// TODO: to be removed as we'll be supporting more errors on search page,
	// see: https://wikia-inc.atlassian.net/browse/DAT-4324
	notFoundError: equal('model.error', 'search-error-not-found'),
	inputPhrase: alias('query'),

	actions: {
		onSearchEnter(query) {
			this.set('inputPhrase', query);
			this.set('query', query);
		},

		onErrorPageClick() {
			const input = document.querySelector('.side-search__input');

			this.set('inputPhrase', '');
			if (input) {
				input.focus();
			}
		},

		onLoadMore() {
			this.get('model').loadMore();
		}
	}
});
