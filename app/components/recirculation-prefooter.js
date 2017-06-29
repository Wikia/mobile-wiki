import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import FandomPostsModel from '../models/fandom-posts';

const {Component, getOwner, on} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		viewportOptionsOverride: on('didInsertElement', function () {
			this.set('model', FandomPostsModel.create(getOwner(this).ownerInjection()));
		})
	}
);
