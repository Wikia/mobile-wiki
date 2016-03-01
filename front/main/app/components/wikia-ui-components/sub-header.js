/**
 * Sub Header reusable component usage example:
 *
 * FIXED HEADER
 * {{wikia-ui-components/sub-header
 *      title=Example title
 *      onBack=actionHandler
 *      onConfirm=actionHandler
 *      backArrowTooltip=Example tooltip
 *      confirmBtnLabel=Save
 *      fixed=true
 * }}
 *
 * NO ACTION BUTTONS
 * {{wikia-ui-components/sub-header
 *      title=Example title
 *      textOnly=true
 * }}
 *
 * "fixed" attribute adds position fixed to the header
 * "textOnly" attribute skips rendering both back arrow and confirmation button
 */

import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'header',
	classNames: ['sub-head'],
	classNameBindings: ['fixed:sub-head--fixed']
});
