export const stringifyQuery = (payload: object) => 
  'search=' + JSON.stringify(payload).replace(/"/g, "").replace(/,/g,';').replace(/{|}/g,'')
