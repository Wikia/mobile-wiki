import Ember from 'ember';
import {track, trackActions} from '../utils/track';

export default Ember.Component.extend({
	tagName: 'a',
	classNames: ['appstore-button'],
	attributeBindings: ['href'],
	href: 'https://itunes.apple.com/us/developer/wikia-inc/id422467077',

	didInsertElement() {
		track({
			action: trackActions.impression,
			category: 'fandom-app-ios-site-head-button',
		});
	},

	click() {
		track({
			action: trackActions.install,
			category: 'fandom-app-ios-site-head-button',
		});
	}

});
