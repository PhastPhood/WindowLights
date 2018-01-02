import { DEFAULT_COLOR, DEFAULT_EFFECT } from '../utils/constants';

type Message = {
  body: string,
  color: string,
  effect: string
};

export default Message;

export function parseTextEffects(message: string):Message {
  const firstIndex = message.indexOf(':');
  if (firstIndex < 0) {
    return { body: message, color: DEFAULT_COLOR, effect: DEFAULT_EFFECT };
  }

  const firstModifier = message.substr(0, firstIndex).trim().toLowerCase();
  if (textEffects.colors.indexOf(firstModifier) >= 0) {
    const color = firstModifier;
    const firstSubstr = message.substr(firstIndex + 1);
    const secondIndex = firstSubstr.indexOf(':');
    if (secondIndex < 0) {
      return { body: firstSubstr, color: color, effect: DEFAULT_EFFECT };
    }

    const secondModifier = firstSubstr.substr(0, secondIndex).trim().toLowerCase();
    if (textEffects.effects.indexOf(secondModifier) >= 0) {
      return { body: firstSubstr.substr(secondIndex + 1), color: color, effect: secondModifier };
    }

    return { body: firstSubstr, color: color, effect: DEFAULT_EFFECT };
  } else if (textEffects.effects.indexOf(firstModifier) >= 0) {
    return { body: message.substr(firstIndex + 1), color: DEFAULT_COLOR, effect: firstModifier };
  }

  return { body: message, color: DEFAULT_COLOR, effect: DEFAULT_EFFECT };
}

export const textEffects = {
  colors: ['white', 'cyan', 'red', 'green', 'purple', 'yellow',
    'flash1', 'flash2', 'flash3', 'glow1', 'glow2', 'glow3'],
  effects: ['none', 'wave', 'wave2', 'shake', 'scroll', 'slide']
};
