import axios from 'axios';
import { config } from '../config/env';

export const request = (
  path = '',
  method = 'GET',
  { headers, data, ...opts }: { headers?: Record<string, string>; data?: any; [key: string]: any } = {}
) => {
  return axios({
    method,
    url: new URL(path, config.FORTRESS_API).href,
    data,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    ...opts,
  });
};

export const subscribeHubspot = (data: any) => {
  return request('/contact', 'POST', { data });
};
