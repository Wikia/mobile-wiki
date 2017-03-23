import Ember from 'ember';
import config from '../../config/environment';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',

	isDev: computed(() => {
		return config.environment === 'dev';
	})
});
