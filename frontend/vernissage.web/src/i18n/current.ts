import en from './en';
import type { Messages } from './en';

// The active dictionary for code outside React (API helpers). The provider keeps it in sync.
let active: Messages = en;

export function currentMessages(): Messages {
  return active;
}

export function setCurrentMessages(messages: Messages): void {
  active = messages;
}
