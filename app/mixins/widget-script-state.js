import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  /**
  * This state is shared between objects that use the mixin.
  * It's used to load external scripts only once
  * even if there are multiple instances of a single component.
  */
  scriptLoadInitialized: {
    mathjax: false,
    twitter: false,
    vk: false,
  },

  /**
  * This state is shared between objects that use the mixin.
  * It's used to update every instance of given component after external script is loaded.
  */
  scriptLoaded: {
    apester: false,
    mathjax: false,
    twitter: false,
    vk: false,
  },
});
