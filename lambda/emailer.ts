import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import Busboy from 'busboy';
import sgMail from '@sendgrid/mail';
import { subscribeHubspot } from './lib/fortress';
import { htmlify } from './lib/utils';
import { config } from './config/env';

interface ParsedData {
  files: { filename: string; mimetype: string; base64: string }[];
  message?: string;
  [key: string]: any; // For other fields
}

export const handler = async function(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: (error?: Error | null, result?: APIGatewayProxyResult) => void
) {
  // helper
  const respond = ({ status = 200, body = {} }: { status?: number; body?: object }) => {
    callback(null, {
      statusCode: status,
      body: body ? JSON.stringify(body) : '',
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

  // prevents huge request payload
  // returns 413 when > 5MB
  const contentLength = +event.headers['content-length']!; // Asserting non-null as per API Gateway spec
  if (contentLength > 5000000) {
    console.log(`'content-length' too large: ${contentLength}`);
    respond({ status: 413 });
    return;
  }

  let data: ParsedData;
  try {
    data = await parser(event);
  } catch (err: unknown) {
    console.log(err);
    respond({ status: 500, body: { error: (err as Error).message } });
    return;
  }

  const { files, message = '', ...fields } = data;

  // send contact to Hubspot
  try {
    await subscribeHubspot({
      email: fields.email,
      name: fields.name,
      source: 'd.foundation/contact',
    });
  } catch (err: unknown) {
    console.log(err);
  }

  // prepare mail data
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  const ourEmail = 'team@d.foundation';
  const bizEmail = 'biz@d.foundation';

  try {
    await sgMail.send(
      // send email to our team
      {
        personalizations: [
          {
            to: ourEmail,
            cc: bizEmail,
            subject: `Inquiry from ${fields.email}`,
          },
        ],
        from: ourEmail,
        html: htmlify(message, fields),
        attachments: files.map(file => ({
          filename: file.filename,
          type: file.mimetype,
          content: file.base64,
          disposition: 'attachment',
        })),
      }
    );
    respond({ status: 200, body: { success: true } });
  } catch (error: unknown) {
    console.log(error);
    respond({ status: 500, body: { error: (error as Error).message } });
  }
};

const parser = ({ headers, body, isBase64Encoded }: APIGatewayProxyEvent): Promise<ParsedData> =>
  new Promise((resolve, reject) => {
    const fields: { [key: string]: any } = {};
    const files: { filename: string; mimetype: string; base64: string }[] = [];
    const busboy = Busboy({ headers: headers as any });
    busboy
      .on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
        console.log(
          'File [%s]: filename=%j; encoding=%j; mimetype=%j',
          fieldname,
          filename,
          encoding,
          mimetype
        );
        const fileObj = { filename, mimetype, base64: '' };
        file
          .on('data', (data: Buffer) => {
            fileObj.base64 = data.toString('base64');
          })
          .on('end', () => {
            files.push(fileObj);
          });
      })
      .on('field', (fieldname: string, value: string) => {
        fields[fieldname] = value;
      })
      .on('error', (error: Error) => reject(error))
      .on('finish', () => {
        resolve({ ...fields, files });
      });
    
    if (body) {
      busboy.end(body, isBase64Encoded ? 'base64' : 'binary');
    } else {
      reject(new Error('Request body is empty for file parsing'));
    }
  });
