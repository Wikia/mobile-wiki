import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import LanguagesMixin from '../mixins/languages';
import {system, isChromeMinVer} from 'common/utils/browser';

export default Ember.Component.extend(
	LanguagesMixin,
	TrackClickMixin,
	{
		classNameBindings: ['displayEdit', 'entrypointClass'],
		displayEdit: Ember.computed('showEdit', function () {
			const showEdit = this.get('showEdit');

			if (showEdit === true) {
				return 'show-edit';
			} else if (showEdit === false) {
				return 'hide-edit';
			}

			return '';
		}),
		shouldShift: Ember.computed(() => {
			// CE-3475 Shift for Android due to Tap to Search
			// Only for Chrome v43+ on Android
			return system === 'android' && isChromeMinVer(43);
		}),
		scrollObserver: Ember.observer('showEdit', function () {
			if (this.get('showEdit')) {
				this.set('entrypointClass', this.get('shouldShift') ?
					'article-edit-highlighted-entrypoint--shifted' :
					'article-edit-highlighted-entrypoint'
				);
				Ember.$(document).on('touchmove.shiftEditButton', this, this.unShift.bind(this));
				Ember.$(window).on('scroll.shiftEditButton', this, this.unShift.bind(this));
			}
		}),
		unShift() {
			this.set('entrypointClass', 'article-edit-highlighted-entrypoint');
			Ember.$(document).off('touchmove.shiftEditButton', this.debouncedScroll);
			Ember.$(window).off('scroll.shiftEditButton', this.debouncedScroll);
		},

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

				this.trackClick('highlighted-editor', label);
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
