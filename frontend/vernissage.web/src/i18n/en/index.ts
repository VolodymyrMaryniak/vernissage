import common from './common';
import exhibitions from './exhibitions';
import workspace from './workspace';
import profile from './profile';
import cv from './cv';
import reel from './reel';
import how from './how';
import home from './home';
import artists from './artists';
import curators from './curators';
import galleries from './galleries';

/** The English dictionary: the source text and the shape every translation must match. */
const en = {
  ...common,
  ex: exhibitions,
  ...workspace,
  profile,
  cv,
  reel,
  how,
  home,
  artists,
  curators,
  galleries,
};

export type Messages = typeof en;
export default en;
