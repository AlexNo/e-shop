import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/products-service';

const createProduct: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
    const service = new ProductService();

    try {
        console.log('[Create Product] data:', event.body);

        const product = await service.create(event.body);

        return formatJSONResponse({
            result: product,
        });
    } catch (e) {
        return formatJSONResponse({error: 'Something went wrong: ' + e.message}, 500);
    }
}

export const main = middyfy(createProduct);