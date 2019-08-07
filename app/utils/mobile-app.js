const mobileAppQueryRegex = /([?&])mobile-app=.+/;

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

function hasMobileAppQueryString() {
  return window.location.search.match(mobileAppQueryRegex);
}

export { isDarkTheme, isMobileApp, hasMobileAppQueryString };
