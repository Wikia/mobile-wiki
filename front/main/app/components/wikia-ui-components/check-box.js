/**
 * Check-box reusable component usage:
 *
 * @example
 * {{wikia-ui-components/check-box
 *      inputId='isCollapsible'
 *      label='Collapse section'
 *      isChecked=true
 * }}
 */

import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'label',
	classNames: ['check-box'],
	attributeBindings: ['inputId:for']
});
