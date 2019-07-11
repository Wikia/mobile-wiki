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
    if (this.config && Object.prototype.hasOwnProperty.call(this.config, key)) {
      return this.config[key];
    }

    if (this.instantGlobals && Object.prototype.hasOwnProperty.call(this.instantGlobals, key)) {
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