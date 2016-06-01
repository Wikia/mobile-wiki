import checkBox from './check-box';

/**
 * Fancy-check-box component usage:
 *
 * @example
 * {{wikia-ui-components/fancy-check-box
 *      inputId='isCollapsible'
 *      label='Collapse section'
 *      isChecked=true
 * }}
 */
export default checkBox.extend({
	classNames: ['fancy-checkbox-label'],
});
