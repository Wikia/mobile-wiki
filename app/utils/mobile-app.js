const mobileAppQueryRegex = /([?&])mobile-app=.+/;

function hasMobileAppQueryString() {
  return window.location.search.match(mobileAppQueryRegex);
}

function isDarkTheme(fastboot) {
  if (fastboot && fastboot.isFastBoot) {
    return fastboot.get('request.queryParams.theme') === 'dark';
  }

  return !!window.location.search.match(/([?&])theme=dark(&|$)/);
}

function isMobileApp(fastboot) {
  if (fastboot && fastboot.isFastBoot) {
    return !!fastboot.get('request.queryParams.mobile-app');
  }

  return !!hasMobileAppQueryString();
}

export { isDarkTheme, isMobileApp, hasMobileAppQueryString };
