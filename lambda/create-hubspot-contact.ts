import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { subscribeHubspot } from './lib/fortress';
import { config } from './config/env';

export const handler = async function(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: (error?: Error | null, result?: APIGatewayProxyResult) => void
) {
  // helper
  const respond = ({ status = 200, body = {} }: { status?: number; body?: object }) => {
    callback(null, {
      statusCode: status,
      body: body ? JSON.stringify(body) : '', // Ensure body is always a string
    });
  };

  // check if env var exist
  if (!config.SENDGRID_API_KEY) {
    callback(new Error('missing SENDGRID_API_KEY'));
    return;
  }

  // logs
  console.log('headers:', event.headers);
  console.log('isBase64Encoded:', event.isBase64Encoded);

  // parse request
  let req: unknown;
  try {
    if (event.body) {
      req = JSON.parse(event.body);
    } else {
      throw new Error('Request body is empty');
    }
  } catch (err: unknown) {
    console.log(err);
    respond({ status: 500, body: { success: false, message: (err as Error).message } });
    return;
  }

  // send contact to Hubspot
  try {
    await subscribeHubspot(req);
    respond({ status: 200, body: { success: true } });
  } catch (err: unknown) {
    console.log(err);
    respond({ status: 500, body: { success: false, message: (err as Error).message } });
  }
};
