import checkBox from './check-box';

/**
 * Fancy-check-box component usage:
 *
 * @example
 * {{wikia-ui-components/fancy-check-box
 *      inputId='isCollapsible'
 *      label='Collapse section'
 *      isChecked=true
 *      onClick=click
 * }}
 */
export default checkBox.extend({
	classNames: ['fancy-checkbox-label'],

	/**
	 * Click event that will be passed to underlying checkbox input.
	 *
	 * @public
	 */
	onClick: null
});
