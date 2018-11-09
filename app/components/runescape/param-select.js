import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'select',

  options: computed('model.range', function () {
    return this.model.range.split(',').map((option) => {
      return {
        val: option,
        selected: option === this.model.def,
      };
    });
  }),

  change(event) {
    // TODO use DDAU
    this.model.def = event.target.value;
  },
});
