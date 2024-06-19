import isDeepEqual from "deep-equal";

export const isEqual = (actual: any, expected: any): boolean => {
  return isDeepEqual(actual, expected, { strict: true });
};
