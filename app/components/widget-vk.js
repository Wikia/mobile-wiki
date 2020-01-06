import { observer } from '@ember/object';
import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';
import RenderComponentMixin from '../mixins/render-component';

/**
  * Widgets
  * @typedef {Object} Widgets
  * @property {Function} Group
  */

/**
  * VK
  * @typedef {Object} VK
  * @property {Widgets} [Widgets]
  */

/**
  * Window
  * @typedef {Object} Window
  * @property {VK} [VK]
  */

export default Component.extend(
  RenderComponentMixin,
  WidgetScriptStateMixin,
  {
    classNames: ['widget-vk'],
    data: null,

    // eslint-disable-next-line ember/no-observers
    scriptLoadedObserver: observer('scriptLoaded.vk', function () {
      this.createWidget();
    }),

    /**
   * @returns {void}
   */
    didInsertElement() {
      this._super(...arguments);

      this.loadScript();
      this.createWidget();
    },

    /**
   * @returns {void}
   */
    loadScript() {
      if (!this.get('scriptLoadInitialized.vk')) {
        this.set('scriptLoadInitialized.vk', true);

        $script('//vk.com/js/api/openapi.js', () => {
          this.set('scriptLoaded.vk', true);
        });
      }
    },

    /**
   * @returns {void}
   */
    createWidget() {
      if (this.get('scriptLoaded.vk')) {
        const elementId = this.elementId;
        const data = this.data;

        window.VK.Widgets.Group(elementId, data, data.groupId);
      }
    },
  },
);
