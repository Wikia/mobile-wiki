import {on} from '@ember/object/evented';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	replacePlaceholder: on('didInsertElement', function () {
		if (this.placeholderElement) {
			this.placeholderElement.parentNode.insertBefore(this.element, this.placeholderElement);
			$(this.placeholderElement).remove();
			this.placeholderElement = null;
		}
	}),
});
