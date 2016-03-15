/**
 * Icon button reusable component usage:
 *
 * @example default invocation
 * {{wikia-ui-components/icon-button
 *      click=action
 *      icon='svg-file-name'
 *  }}
 *
 * @example default invocation with custom class
 * {{wikia-ui-components/icon-button
 *      class='custom-button-class'
 *      click=action
 *      icon='svg-file-name'
 *  }}
 *
 * @example custom icon size
 * {{wikia-ui-components/icon-button
 *      click=action
 *      icon='svg-file-name'
 *      iconSize=24
 *  }}
 *
 * @example with browser link title tooltip
 * {{wikia-ui-components/icon-button
 *      click=action
 *      icon='svg-file-name'
 *      title='tooltip message'
 *  }}
 */

import Ember from 'ember';

export default Ember.Component.extend({
	attributeBindings: ['title'],
	classNames: ['icon-button'],
	iconSize: 16,
	tagName: 'a'
});
