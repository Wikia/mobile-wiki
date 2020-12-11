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
    }, 1000);
  }

  replaceLogo() {
    const fandomLogo = document.querySelector('.wds-global-navigation__logo');
    const fandomLogoParent = document.querySelector('.wds-global-navigation__content-bar-left');
    const fandomHeart = document.querySelector('.wds-global-navigation__logo-heart-link');
    const fandomHeartParent = document.querySelector('.wds-global-navigation__community-bar');
    const separator = document.querySelector('.wds-global-navigation__community-bar-separator');
    const separatorParent = document.querySelector('.wds-global-navigation__community-bar');

    if (fandomLogoParent && fandomLogo && separatorParent && separator) {
      const customLogoAnchorElement = document.createElement('a');
      customLogoAnchorElement.href = this.config.clickThroughUrl || 'https://www.fandom.com/';

      const customLogo = document.createElement('img');
      customLogo.src = this.config.logoImage;
      customLogo.classList.add('custom-logo');

      const smallCustomLogo = document.createElement('img');
      smallCustomLogo.src = this.config.smallSizedLogoImage;
      smallCustomLogo.classList.add('small-custom-logo');

      const trackingPixel = document.createElement('img');
      trackingPixel.src = this.config.pixelUrl;
      trackingPixel.classList.add('tracking-pixel');

      separatorParent.insertBefore(customLogoAnchorElement, separator);
      fandomLogoParent.removeChild(fandomLogo);
      fandomLogoParent.appendChild(trackingPixel);
      customLogoAnchorElement.appendChild(smallCustomLogo);
      customLogoAnchorElement.appendChild(customLogo);

      if (fandomHeartParent && fandomHeart) {
        fandomHeartParent.removeChild(fandomHeart);
      }

      const { events } = window.Wikia.adEngine;
      this.adSlot.emitEvent(events.LOGO_REPLACED);
    }
  }
}
