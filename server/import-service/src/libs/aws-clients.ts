import { S3Client } from '@aws-sdk/client-s3';
import {SQSClient} from '@aws-sdk/client-sqs'

export const s3 = new S3Client({ region: process.env.REGION});

export const sqs = new SQSClient({ region: process.env.REGION });
