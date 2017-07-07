import Ember from 'ember';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

const {Controller, inject} = Ember;

export default Controller.extend(
	WikiPageControllerMixin,
	{
		article: inject.controller(),

		actions: {
			/**
			 * @returns {void}
			 */
			articleRendered() {
				this.get('article').send('articleRendered', ...arguments);
			}
		}
	}
);
