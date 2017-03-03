import Ember from 'ember';

/**
 * This is mostly copied from ember-islands but with some modifications
 */

const {$, assert, getOwner} = Ember;

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
	let componentLookupKey = `component:${name}`,
		layoutLookupKey = `template:components/${name}`,
		layout = owner._lookupFactory(layoutLookupKey),
		component = owner._lookupFactory(componentLookupKey);

	return {component, layout};
}

function replacePlaceholderWithComponent(placeholderElement, componentInstance) {
	placeholderElement.parentNode.insertBefore(componentInstance.element, placeholderElement);
	$(placeholderElement).remove();
}

export function getRenderComponentFor(parent, waitForAfterRender = false) {
	const owner = getOwner(parent);

	return function renderComponent({name, attrs, element: placeholderElement}) {
		const {component, layout} = lookupComponent(owner, name);
		let componentInstance;

		assert(`Component named "${name}" doesn't exist.`, component);

		if (layout) {
			attrs.layout = layout;
		}

		componentInstance = component.create(attrs);
		componentInstance.renderer.appendTo(componentInstance, placeholderElement.parentNode);

		if (waitForAfterRender) {
			Ember.run.scheduleOnce('afterRender', this, () => {
				replacePlaceholderWithComponent(placeholderElement, componentInstance);
			});
		} else {
			replacePlaceholderWithComponent(placeholderElement, componentInstance);
		}

		return componentInstance;
	};
}

export function queryPlaceholders($element) {
	const components = [];

	$element.find('[data-component]').each(function () {
		const name = this.getAttribute('data-component'),
			attrs = componentAttributes(this);

		components.push({attrs, name, element: this});
	});

	return components;
}
