import {EntryType,healthCheckEntryKeys,occupationalHealthcareEntryKeys,hospitalEntryKeys} from './types';

export const isString = (text:unknown):text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isDate = (date:string):boolean => {
  return Boolean(Date.parse(date));
};

export const keepKeys = (obj:{[key:string]:unknown},keys:string[]) => {
  const newObj = Object.keys(obj).reduce((prev:{[key:string]:unknown},current:string) => {
    if(keys.includes(current)) prev[current] = obj[current];
    return prev;
  },{});
  return newObj;
};

export const keepEntryKeys = (obj:{[key:string]:unknown}):{[key:string]:unknown} => {
  if(obj.type===EntryType.HealthCheck) {
    return keepKeys(obj,healthCheckEntryKeys);
  } else if(obj.type===EntryType.OccupationalHealthcare) {
    return keepKeys(obj,occupationalHealthcareEntryKeys);
  } else if(obj.type===EntryType.Hospital) {
    return keepKeys(obj,hospitalEntryKeys);
  }
  return obj;
};