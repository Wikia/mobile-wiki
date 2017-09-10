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
		layout = owner.factoryFor(layoutLookupKey),
		component = owner.factoryFor(componentLookupKey);

	return {component, layout};
}

export function getRenderComponentFor(parent) {
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

		Ember.run.scheduleOnce('afterRender', this, () => {
			placeholderElement.parentNode.insertBefore(componentInstance.element, placeholderElement);
			$(placeholderElement).remove();
		});

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
