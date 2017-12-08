import {on} from '@ember/object/evented';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	didInsertElement() {
		if (this._placeholderElement) {
			this._placeholderElement.parentNode.insertBefore(this.element, this._placeholderElement);
			$(this._placeholderElement).remove();
			this._placeholderElement = null;
		}

		this._super(...arguments);
	},
});
