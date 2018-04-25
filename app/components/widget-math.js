import {observer} from '@ember/object';
import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';

/**
 * MathJax
 * @typedef {Object} MathJax
 */

/**
 * Window
 * @typedef {Object} Window
 * @property {MathJax} [MathJax]
 */

export default Component.extend(
	WidgetScriptStateMixin,
	{
		classNames: ['tex'],
		data: null,

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this._super(...arguments);

			this.loadScript();
			this.renderMath();
		},

		/**
		 * @returns {void}
		 */
		loadScript() {
			if (!this.get('scriptLoadInitialized.mathjax')) {
				// initialize the loading of MathJax just once
				this.set('scriptLoadInitialized.mathjax', true);

				// let's inject a node with MathJax config
				document.head.insertAdjacentHTML('beforeend', `
	<script type="text/x-mathjax-config">
	MathJax.Hub.Config({
		extensions: ["tex2jax.js"],
		jax: ["input/TeX", "output/HTML-CSS"],
		// we will render only specific nodes
		skipStartupTypeset: true,
		tex2jax: {
			inlineMath: [ ['$','$'], ["\\(","\\)"] ],
			displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
			processEscapes: true
		},
		"HTML-CSS": { fonts: ["TeX"] }
	});

	// cast NodeList to an array
	var elements = [].slice.call(window.document.body.querySelectorAll('.tex')); console.log(elements);

	window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, elements]);
	</script>`);

				$script('//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=TeX-MML-AM_CHTML', () => {
					console.log('MathJax loaded');
					this.set('scriptLoaded.mathjax', true);
				});
			}
		},

		/**
		 * @returns {void}
		 */
		renderMath() {
			if (this.get('scriptLoaded.mathjax')) {
				window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.element]);
			}
		},
	}
);
