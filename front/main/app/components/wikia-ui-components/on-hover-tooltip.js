/**
 * Tooltip reusable component usage example:
 *
 * {{wikia-ui-components/on-hover-tooltip
 *      posX=tooltipPosX
 *      posY=tooltipPosY
 *      message='lorem ipsum dolor'
 *      fixed=true
 * }}
 *
 * fixed attribute adds position fixed to the tooltip otherwise it will be absolutely positioned
 */

import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['on-hover-tooltip'],
	classNameBindings: ['fixed:on-hover-tooltip--fixed'],
	attributeBindings: ['style'],

	style: Ember.computed('posX', 'posY', function () {
		const style = `left: ${this.get('posX')}px; top: ${this.get('posY')}px;`;

		return Ember.String.htmlSafe(style);
	})
});
