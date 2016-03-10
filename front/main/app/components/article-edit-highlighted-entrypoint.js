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
		/* CE-3475 Shift for Android due to Tap to Search, only for Chrome v43+ on Android */
		shouldShift: system === 'android' && isChromeMinVer(43),
		shouldRestorePosition: false,
		entrypointClass: Ember.computed('showEdit', 'shouldRestorePosition', function () {
			const entrypointClassDefault = 'article-edit-highlighted-entrypoint';

			if (this.shouldRestorePosition) {
				this.set('shouldRestorePosition', false);
				return entrypointClassDefault;
			}
			if (this.get('showEdit') && this.shouldShift) {
				Ember.$(document).one('touchmove', this, this.triggerRestore.bind(this));
				Ember.$(window).one('scroll', this, this.triggerRestore.bind(this));
				return `${entrypointClassDefault}--shifted`;
			}
			return entrypointClassDefault;
		}),
		triggerRestore() {
			this.set('shouldRestorePosition', true);
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
