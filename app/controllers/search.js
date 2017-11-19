import {inject as service} from '@ember/service';
import {equal, alias} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';
import $ from 'jquery';

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
			this.set('inputPhrase', '');
			$('.side-search__input').focus();
		},

		onLoadMore() {
			this.get('model').loadMore();
		}
	}
});
