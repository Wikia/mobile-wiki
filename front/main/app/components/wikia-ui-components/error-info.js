/**
 * Error info bubble component example usage:
 *
 * @example
 * {{#wikia-ui-components/error-info}}
 * 	<div {{action 'onClick'}}>Some content</div>
 * {{/wikia-ui-components/error-info}}
 */

import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	classNames: ['error-info']
});
