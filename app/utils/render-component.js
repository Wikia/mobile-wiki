import {scheduleOnce} from '@ember/runloop';
import $ from 'jquery';
import {assert} from '@ember/debug';
import {getOwner} from '@ember/application';
import {logEvent} from '../modules/event-logger';

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
	const componentLookupKey = `component:${name}`;

	return owner.factoryFor(componentLookupKey);
}

export function getRenderComponentFor(parent) {
	const owner = getOwner(parent);

	return function renderComponent({name, attrs, element: placeholderElement}) {
		const component = lookupComponent(owner, name);

		assert(`Component named "${name}" doesn't exist.`, component);

		/**
		 * layoutName - for dynamically created components we need to tell Ember where is it's template
		 * @type {string}
		 */
		attrs.layoutName = `components/${name}`;

		let componentInstance = component.create(attrs);
		componentInstance.renderer.appendTo(componentInstance, placeholderElement.parentNode);

		scheduleOnce('afterRender', this, () => {
			if (componentInstance.element instanceof Node) {
				placeholderElement.parentNode.insertBefore(componentInstance.element, placeholderElement);
				$(placeholderElement).remove();
			} else {
				logEvent('render-component--element', {
					componentName: name,
					componentInstanceElement: JSON.stringify(componentInstance.element),
				});
			}
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
