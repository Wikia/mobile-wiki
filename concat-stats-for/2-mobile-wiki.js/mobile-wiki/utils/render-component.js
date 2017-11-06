define('mobile-wiki/utils/render-component', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getRenderComponentFor = getRenderComponentFor;
	exports.queryPlaceholders = queryPlaceholders;
	var scheduleOnce = Ember.run.scheduleOnce;
	var $ = Ember.$;
	var getOwner = Ember.getOwner;


	function componentAttributes(element) {
		var attrsJSON = element.getAttribute('data-attrs');

		var attrs = void 0;

		if (attrsJSON) {
			attrs = JSON.parse(attrsJSON);
		} else {
			attrs = {};
		}

		attrs.innerContent = element.innerHTML;

		return attrs;
	}

	function lookupComponent(owner, name) {
		var componentLookupKey = 'component:' + name;

		return owner.factoryFor(componentLookupKey);
	}

	function getRenderComponentFor(parent) {
		var owner = getOwner(parent);

		return function renderComponent(_ref) {
			var name = _ref.name,
			    attrs = _ref.attrs,
			    placeholderElement = _ref.element;

			var component = lookupComponent(owner, name);

			(true && !(component) && Ember.assert('Component named "' + name + '" doesn\'t exist.', component));


			/**
    * layoutName - for dynamically created components we need to tell Ember where is it's template
    * @type {string}
    */
			attrs.layoutName = 'components/' + name;

			var componentInstance = component.create(attrs);
			componentInstance.renderer.appendTo(componentInstance, placeholderElement.parentNode);

			scheduleOnce('afterRender', this, function () {
				placeholderElement.parentNode.insertBefore(componentInstance.element, placeholderElement);
				$(placeholderElement).remove();
			});

			return componentInstance;
		};
	}

	function queryPlaceholders($element) {
		var components = [];

		$element.find('[data-component]').each(function () {
			var name = this.getAttribute('data-component'),
			    attrs = componentAttributes(this);

			components.push({ attrs: attrs, name: name, element: this });
		});

		return components;
	}
});