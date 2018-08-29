/**
* Detects if user is using iOS or Android system
*
* @returns {string}
*/
const system = ((userAgent) => {
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return 'ios';
  }

  if (/Android/i.test(userAgent)) {
    return 'android';
  }

  return null;
})(window.navigator && navigator.userAgent);

const standalone = window.navigator && navigator.standalone;

export { system, standalone };
