import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  didInsertElement() {
    if (this._placeholderElement) {
      const parent = this._placeholderElement.parentNode;

      parent.insertBefore(this.element, this._placeholderElement);
      parent.removeChild(this._placeholderElement);
      this._placeholderElement = null;
    }

    this._super(...arguments);
  },
});
