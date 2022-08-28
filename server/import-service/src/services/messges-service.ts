import {
    SendMessageCommand,
    SendMessageRequest,
} from '@aws-sdk/client-sqs';

import {sqs} from '@libs/aws-clients';

export class MessagesService {
    static async send(data) {
        try {
            const params: SendMessageRequest = {
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
            };
            const command = new SendMessageCommand(params);
            await sqs.send(command);
            console.log('[MessagesService] message sent successfully');
        } catch (e) {
            console.log('[MessagesService] send error', e);
        }
    }
}