import Ember from 'ember';

export default Ember.Component.extend({
	useArticleName: false,
	isHelpVisible: false,

	articleNameObserver: Ember.observer('useArticleName', function () {
		const title = this.get('useArticleName') ? '{{PAGENAME}}' : '';

		this.set('item.data.default', title);
	}),

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
