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

function lookupComponent(owner, name) {
	let componentLookupKey = `component:${name}`;
	let layoutLookupKey = `template:components/${name}`;
	let layout = owner._lookupFactory(layoutLookupKey);
	let component = owner._lookupFactory(componentLookupKey);

	if (layout && !component) {
		owner.register(componentLookupKey, Component);
		component = owner._lookupFactory(componentLookupKey);
	}

	return {component, layout};
}

/**
 * @param {Component} parent
 * @returns {Function}
 */
export function getRenderComponentFor(parent) {
	const owner = getOwner(parent);

	return function renderComponent({name, attrs, element}) {
		const {component, layout} = lookupComponent(owner, name);
		let componentInstance;

		assert(`Component named "${name}" doesn't exist.`, component);

		if (layout) {
			attrs.layout = layout;
		}

		$(element).empty();
		componentInstance = component.create(attrs);

		// We bypass Ember assertions that prevent appending components which have .ember-view parent
		// Seems to be working fine
		componentInstance.renderer.appendTo(componentInstance, element);

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
