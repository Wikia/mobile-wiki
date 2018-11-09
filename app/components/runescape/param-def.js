import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'input',
  attributeBindings: ['type', 'name'],

  type: 'text',

  change(event) {
    // TODO use DDAU
    this.model.def = event.target.value;
  }
});
