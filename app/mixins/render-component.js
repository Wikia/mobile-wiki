import {on} from '@ember/object/evented';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	didInsertElement() {
		if (this._placeholderElement) {
			const parent = this._placeholderElement.parentNode;

			parent.insertBefore(this.element, this._placeholderElement);
			parent.removeChild(this._placeholderElemen);
			this._placeholderElement = null;
		}

		this._super(...arguments);
	},
});
