import Ember from 'ember';

export default Ember.Component.extend({
	useArticleName: false,

	articleNameObserver: Ember.observer('useArticleName', function () {
		const title = this.get('useArticleName') ? '{{PAGENAME}}' : '';

		this.set('item.data.default', title);
	})
});
