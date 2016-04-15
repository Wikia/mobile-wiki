import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import {system, isChromeMinVer} from 'common/utils/browser';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LanguagesMixin,
	{
		classNameBindings: ['entrypointClass'],
		highlightedTextCurrent: '',
		shouldRestorePosition: false,
		/* CE-3475 Shift for Android due to Tap to Search, only for Chrome v43+ on Android */
		shouldShift: system === 'android' && isChromeMinVer(43),
		entrypointClass: Ember.computed('highlightedText', 'shouldRestorePosition', function () {
			const highlightedText = this.get('highlightedText'),
				entrypointClassDefault = 'article-edit-highlighted-entrypoint';

			if (this.shouldRestorePosition) {
				this.set('shouldRestorePosition', false);
				return entrypointClassDefault;
			}

			if (highlightedText && highlightedText !== this.highlightedTextCurrent) {
				this.set('highlightedTextCurrent', highlightedText);
				if (this.shouldShift) {
					this.bindButtonRestoreEvents();
					return `${entrypointClassDefault}--shifted`;
				}
				return entrypointClassDefault;
			}
			this.unbindButtonRestoreEvents();
			this.set('highlightedTextCurrent', highlightedText);
			return `${entrypointClassDefault}--hidden`;
		}),

		isBound($element, eventName, namespace) {
			const touchmove = Ember.$._data($element[0], 'events');

			return touchmove &&
				touchmove[eventName] &&
				touchmove[eventName].some((elem) => elem.namespace === namespace);
		},

		bindButtonRestoreEvents() {
			const $document = Ember.$(document),
				$window = Ember.$(window),
				eventNamespace = 'restoreEditBtnPos',
				eventTouchmove = 'touchmove',
				eventScroll = 'scroll';

			if (!this.isBound($document, eventTouchmove, eventNamespace)) {
				$document.one(`${eventTouchmove}.${eventNamespace}`, this, this.triggerRestore.bind(this));
			}
			if (!this.isBound($window, eventScroll, eventNamespace)) {
				$window.one(`${eventScroll}.${eventNamespace}`, this, this.triggerRestore.bind(this));
			}
		},

		unbindButtonRestoreEvents() {
			const $document = Ember.$(document),
				$window = Ember.$(window),
				eventNamespace = 'restoreEditBtnPos',
				eventTouchmove = 'touchmove',
				eventScroll = 'scroll';

			if (this.isBound($document, eventTouchmove, eventNamespace)) {
				$document.unbind(`${eventTouchmove}.${eventNamespace}`);
			}
			if (this.isBound($window, eventScroll, eventNamespace)) {
				$window.unbind(`${eventScroll}.${eventNamespace}`);
			}
		},

		/**
		 * Set shouldRestorePosition to true to trigger button move to default position
		 * @returns {void}
		 */
		triggerRestore() {
			this.unbindButtonRestoreEvents();
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
