/**
 * Sub Header reusable component usage:
 *
 * @example
 * FIXED HEADER
 * {{wikia-ui-components/sub-header
 *      backArrowTooltip='Example tooltip'
 *      confirmLabel='Save'
 *      fixed=true
 *      onBack=actionHandler
 *      onConfirm=actionHandler
 *      onTitleClick=actionHandler
 *      title='Example title'
 * }}
 *
 * NO ACTION BUTTONS
 * {{wikia-ui-components/sub-header
 *      textOnly=true
 *      title='Example title'
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
