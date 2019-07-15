export default class AppConfiguration {
  load(instantGlobals = {}) {
    const { instantConfig } = window.Wikia.adEngine;

    this.instantGlobals = instantGlobals;

    return instantConfig.getConfig().then((config) => {
      this.config = config;

      return config;
    });
  }

  get(key, defaultValue = null) {
    if (this.config && key in this.config) {
      return this.config[key];
    }

    if (this.instantGlobals && key in this.instantGlobals) {
      return this.instantGlobals[key];
    }

    return defaultValue;
  }

  isGeoEnabled(key) {
    const { utils } = window.Wikia.adEngine;

    return utils.geoService.isProperGeo(this.get(key), key);
  }
}

export const appConfig = new AppConfiguration();
