import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	{
		tagName: 'nav',
		classNames: ['side-nav'],
		classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],

		homeOfFandomLabel: Ember.get(Mercury, 'wiki.navigation2016.fandomLabel'),
		isFandomVisible: Ember.computed(() => Mercury.wiki.language.content === 'en'),
		scrollMenuToTop: Ember.observer('shouldBeVisible', function () {
			if (!this.get('shouldBeVisible')) {
				this.$('.wikia-drawer__content').scrollTop(0);
			}
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			homeOfFandomClick() {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'open-home-of-fandom'
				});
			}
		}
	}
);
