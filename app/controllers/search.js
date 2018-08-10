import { inject as service } from '@ember/service';
import { equal, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { track, trackActions } from '../utils/track';

export default Controller.extend({
	application: controller(),
	fastboot: service(),
	// TODO: to be removed as we'll be supporting more errors on search page,
	// see: https://wikia-inc.atlassian.net/browse/DAT-4324
	notFoundError: equal('model.error', 'search-error-not-found'),
	inputPhrase: alias('query'),

	actions: {
		onLoadMore(trackLabel) {
			track({
				action: trackActions.click,
				category: 'wikia-button',
				label: trackLabel
			});

			this.model.loadMore();
		}
	}
});
