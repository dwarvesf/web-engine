/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { appConfigService } from './app-config';

function createFormData(
  payload: Record<string, any>,
  attachments: File[] = [],
) {
  const submitFormData = new FormData();
  // form fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => submitFormData.append(`${key}[]`, String(item)));
      } else {
        submitFormData.append(key, String(value));
      }
    }
  });
  // files
  attachments.forEach((file: File) =>
    submitFormData.append('attachments[]', file),
  );
  // Also add a date field to the form data
  submitFormData.append('date', new Date().toString());
  return submitFormData;
}

export function sendEmail(payload: Record<string, any>, attachments?: File[]) {
  const functionAPI = appConfigService.getValue('EMAILER_API');
  if (!functionAPI) {
    throw new Error(
      '[THEME DEFAULT] - EMAILER_API is not defined in app config',
    );
  }
  return axios.post(functionAPI, createFormData(payload, attachments), {
    headers: {
      'content-type': 'application/json',
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createHubspotContact(_payload: Record<string, any>) {
  // This function is currently a placeholder and does not perform any action.
  // Since POST contact route not available in Fortress
  return Promise.resolve();
  // const functionAPI = appConfigService.getValue('HUBSPOT_API');
  // if (!functionAPI) {
  //   throw new Error(
  //     '[THEME DEFAULT] - HUBSPOT_API is not defined in app config',
  //   );
  // }
  // return axios.post(functionAPI, payload, {
  //   headers: {
  //     'content-type': 'application/json',
  //   },
  // });
}
