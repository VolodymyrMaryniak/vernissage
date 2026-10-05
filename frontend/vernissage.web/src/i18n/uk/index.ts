import type { Messages } from '../en';
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

/** Українська. Typed against the English dictionary, so a missing or extra key fails the build. */
const uk: Messages = {
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

export default uk;
