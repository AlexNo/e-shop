import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'product/{id}',
        cors: true,
        documentation: {
          summary: 'Get product by ID',
          description: 'Get product by ID',
          pathParams: [{
            name: 'id',
            description: 'ID of product',
            schema: {
              type: 'string'
            },
          }],
          methodResponses: [{
            statusCode: 200,
            responseBody: {
              description: 'A product object',
            },
            responseModels: {
              'application/json': 'Product',
            }
          }, {
            statusCode: 404,
            responseBody: {
              description: 'Error object',
            },
            responseModels: {
              'application/json': 'Error',
            }
          }, {
            statusCode: 500,
            responseBody: {
              description: 'Server internal error',
            },
            responseModels: {
              'application/json': 'Error',
            }
          }],
        },
      }
    }
  ]
}
