import {on} from '@ember/object/evented';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	_replacePlaceholder: on('didInsertElement', function () {
		if (this._placeholderElement) {
			this._placeholderElement.parentNode.insertBefore(this.element, this._placeholderElement);
			$(this._placeholderElement).remove();
			this._placeholderElement = null;
		}
	}),
});
