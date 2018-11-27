import { DontLogMeError } from '@wikia/ember-fandom/utils/errors';

export default function (fastboot, wikiVariables) {
  if (
    fastboot.isFastBoot
    && wikiVariables.isEmptyDomainWithLanguageWikis
  ) {
    fastboot.get('response.headers').set(
      'location',
      `${wikiVariables.basePath}${wikiVariables.scriptPath}/language-wikis`,
    );
    fastboot.set('response.statusCode', 301);
    throw new DontLogMeError();
  }
}
