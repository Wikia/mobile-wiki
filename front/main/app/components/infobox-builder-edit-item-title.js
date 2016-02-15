import Ember from 'ember';

export default Ember.Component.extend({
	useArticleName: Ember.computed('item.data.default', {
		get() {
			return Boolean(this.get('item.data.default'));
		},
		set(key, value) {
			this.get('editTitleItem')(this.get('item'), value);
			return value;
		}
	}),

	init() {
		this._super(...arguments);
		this.isHelpVisible = false;
	},

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
