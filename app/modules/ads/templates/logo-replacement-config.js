export const getConfig = () => ({
    replaceLogo: (logoImage, pixelUrl, clickThroughUrl) => {
      const fandomLogo = document.querySelector('.wds-global-navigation__logo');
      const fandomLogoParent = document.querySelector('.wds-global-navigation__content-bar-left');
      const fandomHeart = document.querySelector('.wds-global-navigation__logo-heart-link');
      const fandomHeartParent = document.querySelector('.wds-global-navigation__community-bar');
      const separator = document.querySelector('.wds-global-navigation__community-bar-separator');
      const separatorParent = document.querySelector('.wds-global-navigation__community-bar');

      if (fandomLogoParent && fandomLogo && separatorParent && separator) {
        const newLogoAnchorElement = document.createElement('a');
        newLogoAnchorElement.href = clickThroughUrl;

        const newLogo = document.createElement('img');
        newLogo.src = logoImage;

        const trackingPixel = document.createElement('img');
        trackingPixel.src = pixelUrl;
        trackingPixel.style.display = 'none';

        separatorParent.insertBefore(newLogoAnchorElement, separator);
        fandomLogoParent.removeChild(fandomLogo);
        fandomLogoParent.appendChild(trackingPixel);
        newLogoAnchorElement.appendChild(newLogo);

        if (fandomHeartParent && fandomHeart) {
          fandomHeartParent.removeChild(fandomHeart);
        }
      }
    }
  }
);

export default {
  getConfig,
};
