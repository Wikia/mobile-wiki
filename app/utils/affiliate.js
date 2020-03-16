import config from '../config/environment';

function getServiceHost() {
  if (config.environment === 'production') {
    return 'https://services.fandom.com/affiliate/redirect/'; // add r=
  }

  return 'https://services.fandom-dev.us/affiliate/redirect/';
}

export function trackingPairsToObject(unit) {
  const tracking = {
    algo: '',
    method: '',
    version: '',
    recommendation_level: '',
  };

  if (unit.tracking && unit.tracking.forEach && typeof unit.tracking.forEach === 'function') {
    unit.tracking.forEach((kv) => {
      tracking[`${kv.key}`] = kv.val;
    });
  }

  return tracking;
}

export function linkToProxyLink(link, unit, wikiId, articleId = -1) {
  const host = getServiceHost();
  const tracking = trackingPairsToObject(unit);

  const category = unit.category;

  // wikiId/articleId/category/algorithm/method/version
  const path = `${wikiId}/${articleId}/${category}/${tracking.algo}/${tracking.method}/${tracking.version}`;

  const potentialLink = `${host}${path}?r=${encodeURIComponent(link)}`;

  // if we reach the limit lets serve them the link without the tracking
  if (potentialLink.length > 2000) {
    return link;
  }

  return potentialLink;
}
