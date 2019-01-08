import { WikiIsClosedError } from './errors';

export default function (wikiVariables) {
  if (wikiVariables.isClosed) {
    throw new WikiIsClosedError();
  }
}
