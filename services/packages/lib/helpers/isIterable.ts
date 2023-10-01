export const isIterable = (input: any) => {
  if (input === null || input === undefined) {
    return false;
  }
  return typeof input[Symbol.iterator] === 'function';
};
