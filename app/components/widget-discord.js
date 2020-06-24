import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
  RenderComponentMixin,
  WidgetScriptStateMixin,
  {
    classNames: ['widget-discord'],
    data: null,

    /**
   * @returns {void}
   */
    didInsertElement() {
      this._super(...arguments);

      this.createWidget();
    },

    /**
   * @returns {void}
   */
    createWidget() {
      const url = `https://discord.com/widget?id=${this.data.id}&theme=${this.data.theme}`

      this.element.innerHTML = `<iframe frameborder="0" width="100%" height="${this.data.height}" src="${url}" />`;
    },
  },
);
