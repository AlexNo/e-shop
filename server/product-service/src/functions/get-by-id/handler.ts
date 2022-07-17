import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import {fakeGetAll} from "../../mocks/products";

const getById: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const { id } = event.pathParameters;

  console.log('getById ID', id);
  try {
    const result = await fakeGetAll();
    const product = result.find((p) => p.id === id);

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
