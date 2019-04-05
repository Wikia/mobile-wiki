const invisibleHighImpactWrapperId = 'InvisibleHighImpactWrapper';

export const getConfig = () => (
  {
    onInit: () => {
      const { events, eventService } = window.Wikia.adEngine;
      const wrapper = document.getElementById(invisibleHighImpactWrapperId);

      wrapper.classList.add('out-of-page-template-loaded');
      wrapper.classList.remove('hidden');

      eventService.on(events.BEFORE_PAGE_CHANGE_EVENT, () => {
        wrapper.classList.add('hidden');
      });
    },
  }
);

export default {
  getConfig,
};
