import { helper } from '@ember/component/helper';

/**
 * Returns style string with thumbnail url and gradient applied.
 *
 * @param {string} thumbnail
 * @returns {string}
 */
export default helper(
	thumbnail => `background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000), url(${thumbnail});`,
);
