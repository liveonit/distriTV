export const removeEmpty = <T>(obj: T) => {
  const newObj: any = {};
  const localObj = {...obj } as any
  Object.keys(localObj).forEach((key) => {
    if (localObj[key] === Object(localObj[key])) newObj[key] = removeEmpty(localObj[key]);
    else if (localObj[key] !== undefined && localObj[key] !== null) newObj[key] = localObj[key];
  });
  return newObj;
};