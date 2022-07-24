import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        documentation: {
          summary: 'Get list of products',
          description: 'Get list of products',
          methodResponses: [{
            statusCode: 200,
            responseBody: {
              description: 'A list of products',
            },
            responseModels: {
              'application/json': 'ProductList',
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
