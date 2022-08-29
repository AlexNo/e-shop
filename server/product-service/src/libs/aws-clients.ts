import {SNSClient} from '@aws-sdk/client-sns'

export const sns = new SNSClient({ region: process.env.REGION });
