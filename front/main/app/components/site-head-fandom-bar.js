import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {computed, Component, get} = Ember;

export default Component.extend({
	classNames: ['site-head-fandom-bar-wrapper'],
	isVisible: computed.not('isSearchPage')
});
