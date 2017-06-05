import initMoatVideoTracking from './moat-video-tracking-script';

const DEFAULT_CONFIG = {
    partnerCode: 'wikiaimajsint377461931603',
    viewMode: 'normal', // google.ima.ViewMode.NORMAL
    slicer1: '',
    slicer2: ''
};


function moatVideoTracker(adsManager, adContainer, viewMode, src, pos) {
    let config = Object.assign({}, DEFAULT_CONFIG);

    config.viewMode = viewMode || DEFAULT_CONFIG.viewMode;
    config.slicer1 = src || DEFAULT_CONFIG.slicer1;
    config.slicer2 = pos || DEFAULT_CONFIG.slicer2;

    initMoatVideoTracking(adsManager, config, adContainer);
}

export default moatVideoTracker;
