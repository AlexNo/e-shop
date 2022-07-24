import type { AWS } from '@serverless/typescript';

import getAll from '@functions/get-all';
import getById from '@functions/get-by-id';

import documentation from 'serverless.docs';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    documentation,
  },
  plugins: [
      'serverless-webpack',
      'serverless-openapi-documentation',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getAll, getById },
};

module.exports = serverlessConfiguration;
