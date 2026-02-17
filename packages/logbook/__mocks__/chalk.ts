const identity = (value: string): string => value;

export default {
  green: identity,
  yellow: identity,
  red: identity,
  bold: identity,
  blue: identity,
  cyan: identity,
  magenta: identity,
  gray: identity,
  white: identity
};

export const level = () => 0;
