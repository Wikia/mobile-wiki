import {Component, Object} from 'ember';

export default Component.extend({
	classNames: ['wds-global-navigation'],
	model: Object.create(M.prop('globalNavigationData'))
});
