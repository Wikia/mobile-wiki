import Mixin from '@ember/object/mixin';
import {on} from '@ember/object/evented';
import {run} from '@ember/runloop';

export default Mixin.create({
	classNames: ['notifications-scroll-menu'],
	classNameBindings: ['isLoadingNewResults'],
	almostBottom: 100,

	didInsertElement() {
		this._super(arguments);

		this.set('scrollableElement', this.element.querySelector('.scrolling-part'));

		this.onScrollHandler = this.onScroll.bind(this);
		this.onMouseWheelHandler = this.onMouseWheel.bind(this);
		this.listeners('addEventListener');
	},

	willDestoryElement() {
		this._super(arguments);

		this.listeners('removeEventListener');
	},

	listeners(method) {
		const scrollableElement = this.get('scrollableElement');

		scrollableElement[method]('scroll', this.onScrollHandler);
		scrollableElement[method]('DOMMouseScroll', this.onMouseWheelHandler);
		scrollableElement[method]('mousewheel', this.onMouseWheelHandler);
	},

	onScroll({target}) {
		if (this.hasAlmostScrolledToTheBottom(target)) {
			this.get('notifications').loadNextPage();
		}
	},

	onMouseWheel(event) {
		const scrollableElement = this.get('scrollableElement'),
			delta = -event.wheelDelta || event.detail,
			scrollTop = scrollableElement.scrollTop;

		if (
			(delta < 0 && scrollTop === 0) ||
			(delta > 0 && scrollableElement.scrollHeight - scrollableElement.clientHeight - scrollTop === 0)
		) {
			event.preventDefault();
		}
	},

	/**
	 * Has the user scrolled almost to the bottom?
	 * @private
	 */
	hasAlmostScrolledToTheBottom(element) {
		return element.scrollHeight - this.almostBottom <= element.scrollTop + element.clientHeight;
	}

});
