import Ember from 'ember';

export default Ember.Component.extend({
	siteName: Ember.computed('openGraphData.domain', 'openGraphData.siteName', function () {
		return this.get('openGraphData.siteName') || this.get('openGraphData.domain');
	}),
});
