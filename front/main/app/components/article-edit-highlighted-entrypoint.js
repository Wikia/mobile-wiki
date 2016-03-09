import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import LanguagesMixin from '../mixins/languages';

export default Ember.Component.extend(
	LanguagesMixin,
	{
		classNameBindings: ['displayEdit', 'entrypoinClass'],
		displayEdit: Ember.computed('showEdit', function () {
			const showEdit = this.get('showEdit');

			if (showEdit === true) {
				return 'show-edit';
			} else if (showEdit === false) {
				return 'hide-edit';
			}

			return '';
		}),
		entrypoinClass: Ember.computed(() => {
			// CE-3475 Shift for Android due to Tap to Search
			return navigator.userAgent.toLowerCase().indexOf('android') > -1 ?
				'article-edit-highlighted-entrypoint--shifted' :
				'article-edit-highlighted-entrypoint';
		}),
		actions: {
			editSection() {
				const title = this.get('title'),
					section = this.get('section'),
					highlightedText = this.get('highlightedText');
				let label;

				if (this.get('editAllowed')) {
					this.sendAction('edit', title, section, highlightedText);
					label = 'entry-point-allowed';
				} else {
					this.redirectToLogin(title, section, highlightedText);
					label = 'entry-point-not-allowed';
				}
				track({
					action: trackActions.click,
					category: 'highlighted-editor',
					label
				});
			}
		},

		redirectToLogin(title, section, highlightedText) {
			let redirect = `${window.location.origin}/wiki/edit/${title}/${section}`;

			if (highlightedText) {
				redirect += `?highlighted=${highlightedText}`;
			}

			window.location.assign(M.buildUrl({path: '/join', query: {redirect}}));
		}
	}
);
