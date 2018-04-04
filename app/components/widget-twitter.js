import {observer} from '@ember/object';
import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';
import RenderComponentMixin from '../mixins/render-component';

/**
 * Widgets
 * @typedef {Object} Widgets
 * @property {Function} createTimeline
 */

/**
 * Twttr
 * @typedef {Object} Twttr
 * @property {Widgets} [widgets]
 */

/**
 * Window
 * @typedef {Object} Window
 * @property {Twttr} [twttr]
 */

export default Component.extend(
	WidgetScriptStateMixin,
	{
		data: null,
		tagName: '',

		scriptLoadedObserver: observer('scriptLoaded.twitter', function () {
			this.createTimeline();
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this._super(...arguments);

			this.loadScript();
			this.createTimeline();
		},

		/**
		 * @returns {void}
		 */
		loadScript() {
			if (!this.get('scriptLoadInitialized.twitter')) {
				this.set('scriptLoadInitialized.twitter', true);

				$script('//platform.twitter.com/widgets.js', () => {
					this.set('scriptLoaded.twitter', true);
				});
			}
		},

		/**
		 * @returns {void}
		 */
		createTimeline() {
			if (this.get('scriptLoaded.twitter')) {
				const data = this.get('data');

				window.twttr.widgets.createTimeline(data.widgetId, this._placeholderElement.querySelector('.twitter'), data);
			}
		},
	}
);
