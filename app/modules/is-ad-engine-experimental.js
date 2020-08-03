function isAdEngineExperimental() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('adengine_experimental');

    return param === '1';
  } catch (e) {
    return false;
  }
}

export default isAdEngineExperimental;
