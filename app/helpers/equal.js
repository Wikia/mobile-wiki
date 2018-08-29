import { helper } from '@ember/component/helper';

/**
  * Check if two arguments are equals
  *
  * @param {Array} params
  * @returns {string}
  */
export default helper(params => params[0] === params[1]);
