import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';

export default Ember.Component.extend({
	classNames: ['reported'],

	canDelete: Ember.computed(function () {
		return checkPermissions(this.get('post'), 'canModerate') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canModerate: Ember.computed(function () {
		return checkPermissions(this.get('post'), 'canModerate');
	}),
});
