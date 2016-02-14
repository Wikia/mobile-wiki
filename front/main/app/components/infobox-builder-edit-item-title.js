import Ember from 'ember';

export default Ember.Component.extend({
	isHelpVisible: false,
	useArticleName: null,

	/**
	 * once the item.data.default changes, update useArticleName
	 * to ensure they're always in sync, also on the first load of component
	 * and switching between infobox title rows.
	 * useArticleName should be set to false if item.data.default is empty
	 *
	 * @return {void}
	 */
	currentItemObserver: Ember.observer('item.data.default', function () {
		this.set('useArticleName', Boolean(this.get('item.data.default')));
	}),

	/**
	 * once the value of useArticleName changes,
	 * call the editTitleItem action with the updated value of useArticleName
	 *
	 * @return {void}
	 */
	useArticleNameObserver: Ember.observer('useArticleName', function () {
		if (Boolean(this.get('item.data.default')) !== this.get('useArticleName')) {
			this.get('editTitleItem')(this.get('item'), this.get('useArticleName'));
		}
	}),

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
