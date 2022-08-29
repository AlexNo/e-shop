import type { AWS } from '@serverless/typescript';

import getAll from '@functions/get-all';
import getById from '@functions/get-by-id';
import create from '@functions/create';
import catalogBatchProcess from '@functions/catalogBatchProcess';

import documentation from 'serverless.docs';

import * as env from './env.json';

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
      'serverless-dotenv-plugin'
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: { Ref: 'createProductTopic' },
      SNS_EMAIL : process.env.SNS_EMAIL,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [{ 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] }],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [{ Ref: 'createProductTopic' }],
      },
    ],
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName: process.env.SQS_QUEUE_NAME },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: { TopicName: process.env.SNS_TOPIC_NAME },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: env.SNS_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'createProductTopic' },
        },
      },
    },
  },
  // import the function via paths
  functions: { getAll, getById, create, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
