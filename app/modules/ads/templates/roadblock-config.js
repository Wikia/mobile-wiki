export const getConfig = (useTopBoxad) => ({
  slotsToEnable: [
    useTopBoxad ? 'top_boxad' : 'incontent_boxad_1',
  ],
  slotsToDisable: [
    useTopBoxad ? 'incontent_boxad_1' : 'top_boxad',
    'incontent_player',
  ],
});

export default {
  getConfig,
};
