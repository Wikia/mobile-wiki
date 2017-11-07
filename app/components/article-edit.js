import $ from 'jquery';
import {on} from '@ember/object/evented';
import {observer} from '@ember/object';
import Component from '@ember/component';
import ViewportMixin from '../mixins/viewport';

export default Component.extend(
	ViewportMixin,
	{
		classNames: ['article-edit'],

		viewportHeightObserver: observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: on('didInsertElement', () => {
			$('textarea').css('height', $(window).height() - $('.sub-head').outerHeight());
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			back() {
				this.sendAction('back');
			},

			/**
			 * @returns {void}
			 */
			publish() {
				this.sendAction('publish');
			},
		},
	}
);
