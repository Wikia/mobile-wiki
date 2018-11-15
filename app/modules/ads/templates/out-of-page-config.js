const invisibleHighImpactWrapperId = 'InvisibleHighImpactWrapper';

export const getConfig = () => (
  {
    onInit: () => {
      const wrapper = document.getElementById(invisibleHighImpactWrapperId);

      wrapper.classList.add('out-of-page-template-loaded');
    },
  }
);

export default {
  getConfig,
};
