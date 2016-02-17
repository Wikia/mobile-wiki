import Ember from 'ember';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Component.extend({
	classNames: ['recent-edit'],
	classNameBindings: ['loaded'],
	loaded: false,
	recentEdit: null,
	init() {
		this._super(...arguments);
		RecentWikiActivityModel.getRecentActivityList().then((recentEdit) => {
			this.set('loaded', true);
			this.set('recentEdit', recentEdit.recentChanges.get('firstObject'));
		});

	}
});
