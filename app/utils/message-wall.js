export function getMessageWallOwner(url) {
  const regex = /\/Message_Wall:(.+?)([?#/].*)?$/i;
  const result = regex.exec(url);

  if (!result || !result[1]) {
    return null;
  }

  return result[1];
}

export function getPossiblyAnonActorName(model) {
  return model.get('latestActors[0]') && model.get('latestActors[0].name')
    ? model.get('latestActors[0].name')
    : 'A Fandom User';
}
