import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import {formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { fakeGetAll } from '../../mocks/products';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  try {
    const result = await fakeGetAll();
    return formatJSONResponse({
      items: result,
      total: result.length,
    });
  } catch (e) {
    return formatJSONResponse({
      error: 'Failed to find a list of products',
    }, 500);
  }
}

export const main = middyfy(getAllProducts);
