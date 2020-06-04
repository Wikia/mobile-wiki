export default class LogoReplacement {
  static getName() {
    return 'logoReplacement';
  }

  static getDefaultConfig() {
    return {};
  }

  constructor(adSlot) {
    const { context } = window.Wikia.adEngine;
    this.adSlot = adSlot;
    this.config = context.get('templates.logoReplacement') || {};
  }

  init(params) {
    const { utils } = window.Wikia.adEngine;
    utils.logger(LogoReplacement.getName(), 'init');
    this.config = Object.assign(this.config, params);

    setTimeout(() => {
      this.replaceLogo();
    }, 1500);
  }

  replaceLogo() {
    const fandomLogo = document.querySelector('.wds-global-navigation__logo');
    const fandomLogoParent = document.querySelector('.wds-global-navigation__content-bar-left');
    const fandomHeart = document.querySelector('.wds-global-navigation__logo-heart-link');
    const fandomHeartParent = document.querySelector('.wds-global-navigation__community-bar');
    const separator = document.querySelector('.wds-global-navigation__community-bar-separator');
    const separatorParent = document.querySelector('.wds-global-navigation__community-bar');

    if (fandomLogoParent && fandomLogo && separatorParent && separator) {
      const newLogoAnchorElement = document.createElement('a');
      newLogoAnchorElement.href = this.config.clickThroughUrl || 'https://www.fandom.com/';

      const newLogo = document.createElement('img');
      newLogo.src = this.config.logoImage;
      newLogo.classList.add('new-logo');

      const trackingPixel = document.createElement('img');
      trackingPixel.src = this.config.pixelUrl;
      trackingPixel.classList.add('tracking-pixel');

      separatorParent.insertBefore(newLogoAnchorElement, separator);
      fandomLogoParent.removeChild(fandomLogo);
      fandomLogoParent.appendChild(trackingPixel);
      newLogoAnchorElement.appendChild(newLogo);

      if (fandomHeartParent && fandomHeart) {
        fandomHeartParent.removeChild(fandomHeart);
      }

      const { events } = window.Wikia.adEngine;
      this.adSlot.emitEvent(events.LOGO_REPLACED);
    }
  }
}
