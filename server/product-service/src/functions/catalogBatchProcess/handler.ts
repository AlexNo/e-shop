import type {Handler, SQSEvent} from 'aws-lambda';

import { middyfy } from '@libs/lambda';
import {formatJSONResponse} from '@libs/apiGateway';
import {ProductService} from "@services/products-service";

export const catalogBatchProcess:Handler = async ({Records}: SQSEvent) => {
  const service = new ProductService();

  try {
    await service.handleProductsQueue(Records);

    return formatJSONResponse({message: 'ok'});
  } catch (e) {
    console.error('[catalogBatchProcess]', e);

    return formatJSONResponse({error: 'Something went wrong: ' + e.message}, 500);
  }
};

export const main = middyfy(catalogBatchProcess);