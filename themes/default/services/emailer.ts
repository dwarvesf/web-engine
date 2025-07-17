import axios from 'axios';
import { appConfigService } from './app-config';

export function sendEmail(payload: FormData) {
  const functionAPI = appConfigService.getValue('EMAILER_API');
  if (!functionAPI) {
    throw new Error(
      '[THEME DEFAULT] - EMAILER_API is not defined in app config',
    );
  }
  return axios.post(functionAPI, payload, {
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function createHubspotContact(payload: FormData) {
  const functionAPI = appConfigService.getValue('HUBSPOT_API');
  if (!functionAPI) {
    throw new Error(
      '[THEME DEFAULT] - HUBSPOT_API is not defined in app config',
    );
  }
  return axios.post(functionAPI, payload, {
    headers: {
      'content-type': 'application/json',
    },
  });
}
