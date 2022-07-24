import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/products-service';

const getById: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const { id } = event.pathParameters;

  console.log('[Get Product By ID]:', id);
  const service = new ProductService();
  try {
    const product = await service.getByID(id);

    if (!product) {
      return formatJSONResponse({
        error: `Product with ID ${id} not found`,
      }, 404);
    }

    return formatJSONResponse(product);
  } catch (e) {
    return formatJSONResponse({
      error: `Failed to find product with ID ${id}`,
    }, 500);
  }
}

export const main = middyfy(getById);
