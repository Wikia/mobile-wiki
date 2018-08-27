import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';
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
  RenderComponentMixin,
  WidgetScriptStateMixin,
  {
    tagName: 'span',
    classNames: ['widget-math'],
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
		"HTML-CSS": {
			availableFonts: ["STIX","TeX"],
			webFont: "TeX",
			imageFont: "TeX",
			undefinedFamily: "STIXGeneral,'Arial Unicode MS',serif",
		}
	});

	// From https://en.wikipedia.org/wiki/User:Nageh/mathJax/config/TeX-AMS-texvc_HTML.js
	var MML = MathJax.ElementJax.mml;

	MathJax.Hub.Insert(MathJax.InputJax.TeX.Definitions,{
		mathchar0mi: {
			C:            ['0043',{mathvariant: MML.VARIANT.DOUBLESTRUCK}],
			N:            ['004E',{mathvariant: MML.VARIANT.DOUBLESTRUCK}],
			R:            ['0052',{mathvariant: MML.VARIANT.DOUBLESTRUCK}],
			Z:            ['005A',{mathvariant: MML.VARIANT.DOUBLESTRUCK}],
			infin:        ['221E',{mathvariant: MML.VARIANT.NORMAL}],  // infty
			part:         ['2202',{mathvariant: MML.VARIANT.NORMAL}],  // partial
		}
	});

	// cast NodeList to an array
	var elements = [].slice.call(window.document.body.querySelectorAll('.tex'));

	window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, elements]);
	</script>`);

        $script('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=TeX-MML-AM_CHTML-full', () => {
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
  },
);
