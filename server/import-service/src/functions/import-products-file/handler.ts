import 'source-map-support/register';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import {s3} from '@libs/aws-clients';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const {name} = event.queryStringParameters;

  const {
    BUCKET_NAME,
    S3_UPLOADED_FOLDER,
  } = process.env;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${S3_UPLOADED_FOLDER}${name}`
  }

  try {
    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(params), {expiresIn: 3600})

    return formatJSONResponse({
      url: signedUrl,
    });
  } catch (e) {
    return formatJSONResponse({
      error: 'Failed to find a list of products',
    }, 500);
  }
}

export const main = middyfy(importProductsFile);
