import Ember from 'ember';

/**
 * This is mostly copied from ember-islands but with some modifications
 */

const {$, assert, getOwner} = Ember;

/**
 * @param {HTMLElement} element
 * @returns {Object}
 */
function componentAttributes(element) {
	const attrsJSON = element.getAttribute('data-attrs');

	let attrs;

	if (attrsJSON) {
		attrs = JSON.parse(attrsJSON);
	} else {
		attrs = {};
	}

	attrs.innerContent = element.innerHTML;

	return attrs;
}
/**
 * @param {Component} parent
 * @returns {Function}
 */
export function getRenderComponentFor(parent) {
	const componentLookup = getOwner(parent).lookup('component-lookup:main');

	return function renderComponent({name, attrs, element}) {
		const component = componentLookup.container.lookupFactory(`component:${name}`);

		let componentInstance;

		assert(`Component named "${name}" doesn't exist.`, component);

		componentInstance = component.create(attrs);

		// It has to be rendered outside .ember-view because of Ember's assertion
		componentInstance.appendTo($('#ember-component-constructor'));

		// Wait until component element is rendered in DOM and ready to be moved
		Ember.run.scheduleOnce('afterRender', this, () => {
			// Take component element out from the temp container and put it just before its placeholder
			element.parentNode.insertBefore(componentInstance.element, element);

			// Remove the placeholder
			$(element).remove();
		});

		return componentInstance;
	};
}

/**
 * @param {JQuery} $element
 * @returns {Array}
 */
export function queryPlaceholders($element) {
	const components = [];

	$element.find('[data-component]').each(function () {
		const name = this.getAttribute('data-component'),
			attrs = componentAttributes(this);

		components.push({attrs, name, element: this});
	});

	return components;
}
