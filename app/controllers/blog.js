import Ember from 'ember';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

const {Controller, computed, inject} = Ember;

export default Controller.extend(WikiPageControllerMixin, {
	application: inject.controller(),
	article: inject.controller(),

	commentsPage: computed.alias('application.commentsPage'),

	actions: {
		articleRendered() {
			this.get('article').send('articleRendered', ...arguments);
		}
	}
});
