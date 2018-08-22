import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

function componentAttributes(element) {
	const attrsJSON = element.getAttribute('data-attrs');

	let attrs;

	if (attrsJSON) {
		attrs = JSON.parse(attrsJSON);
	} else {
		attrs = {};
	}

	return attrs;
}

function lookupComponent(owner, name) {
	const componentLookupKey = `component:${name}`;

	return owner.factoryFor(componentLookupKey);
}

export function getRenderComponentFor(parent) {
	const owner = getOwner(parent);

	return function renderComponent({ name, attrs, element: placeholderElement }) {
		const component = lookupComponent(owner, name);

		assert(`Component named "${name}" doesn't exist.`, component);

		/**
		 * layoutName - for dynamically created components we need to tell Ember where is it's template
		 * @type {string}
		 */
		attrs.layoutName = `components/${name}`;
		attrs._placeholderElement = placeholderElement;

		let componentInstance = component.create(attrs);
		componentInstance.renderer.appendTo(componentInstance, placeholderElement.parentNode);

		return componentInstance;
	};
}

export function queryPlaceholders(element) {
	const components = [];
	let componentElements = element.querySelectorAll('[data-component]');

	Array.prototype.forEach.call(componentElements, (componentElement) => {
		// if component is visible
		if (componentElement.offsetParent) {
			const name = componentElement.getAttribute('data-component');
			const attrs = componentAttributes(componentElement);

			components.push({ attrs, name, element: componentElement });
		}
	});

	return components;
}
