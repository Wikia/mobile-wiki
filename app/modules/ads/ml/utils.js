export default function hasAvailableModels(btlConfig, projectName) {
  const { utils } = window.Wikia.adEngine;
  const projects = btlConfig.projects;

  return projects && projects[projectName]
    && projects[projectName].some(
      model => utils.geoService.isProperGeo(model.countries, model.name),
    );
}
