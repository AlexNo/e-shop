import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import {formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/products-service';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  console.log('[Get All Products]');
  const service = new ProductService();
  try {
    const result = await service.getAll();
    console.log('[Get All Products] total items:', result.length);
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
