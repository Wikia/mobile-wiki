import checkBox from './check-box';

/**
 * Fancy-check-box component usage:
 *
 * @example
 * {{wikia-ui-components.fancy-check-box
 *      inputId='isCollapsible'
 *      label='collapse section'
 *      isChecked=true
 *      update=update
 * }}
 */
export default checkBox.extend({
	classNames: ['fancy-checkbox-label'],
});
