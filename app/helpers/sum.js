import { helper } from '@ember/component/helper';

/**
 * returns sum of all arguments
 */
export default helper(params => params.reduce((acc, val) => acc + val));
