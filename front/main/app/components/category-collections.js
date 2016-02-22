import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

const {Component} = Ember;

export default Component.extend(
	TrackClickMixin,
	{
		classNames: ['category-collections'],
	}
);
