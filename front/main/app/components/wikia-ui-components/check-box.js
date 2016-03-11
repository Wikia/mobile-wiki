/**
 * Check-box reusable component usage:
 *
 * @example
 * {{wikia-ui-components/check-box
 *      inputId='isCollapsible'
 *      label='Collapse section'
 * }}
 */

import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'label',
	classNames: ['check-box'],
	attributeBindings: ['htmlFor:for'],
	htmlFor: Ember.computed.oneWay('inputId')
});
