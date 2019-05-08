const invisibleHighImpactWrapperCls = 'invisible-high-impact-wrapper';

export const getConfig = () => (
  {
    onInit: () => {
      const { events, eventService } = window.Wikia.adEngine;
      const wrappers = [...document.getElementsByClassName(invisibleHighImpactWrapperCls)];

      wrappers.forEach((wrapper) => {
        wrapper.classList.add('out-of-page-template-loaded');
        wrapper.classList.remove('hidden');

        eventService.on(events.BEFORE_PAGE_CHANGE_EVENT, () => {
          wrapper.classList.add('hidden');
        });
      });
    },
  }
);

export default {
  getConfig,
};
