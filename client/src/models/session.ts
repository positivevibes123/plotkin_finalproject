import * as myfetch from '../models/myfetch';

export function api<T>(action: string): Promise<T> {
  return myfetch.api<T>(action)
}