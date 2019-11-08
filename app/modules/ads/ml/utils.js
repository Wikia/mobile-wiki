/**
 *  Returns `true` if projectName is inside bill the lizard config (btlConfig)
 *
 * @param {Object} btlConfig
 * @param {string} projectName
 * @returns {boolean}
 */

export default function hasAvailableModels(btlConfig, projectName) {
  const { utils } = window.Wikia.adEngine;
  const projects = btlConfig.projects;

  return projects && projects[projectName]
    && projects[projectName].some(
      model => utils.geoService.isProperGeo(model.countries, model.name),
    );
}
