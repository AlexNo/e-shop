import 'source-map-support/register';
import {GetObjectCommand} from '@aws-sdk/client-s3';
import type {Handler, S3Event} from 'aws-lambda';

import {s3} from '@libs/aws-clients';
import {middyfy} from '@libs/lambda';
import { FileService } from '@services/file-service';
import {MessagesService} from "@services/messges-service";

const importFileParser:Handler = async (event:S3Event) => {
    for (const record of event.Records) {
        const { object, bucket } = record.s3;
        const params = {
            Bucket: bucket.name,
            Key: object.key,
        };

        console.log('[import-file-parser] record:', JSON.stringify(record));

        const command = new GetObjectCommand(params);
        const response = await s3.send(command);

        console.log('[import-file-parser] GetObjectCommand:', response);

        const parsedResults = await FileService.parseCSV(response.Body);
        console.log('[import-file-parser] parsed csv:', parsedResults);

        await MessagesService.send(parsedResults);

        const success = await FileService.moveToParsed(bucket, object);
        if (success) {
            await FileService.delete(bucket, object);
        }
    }
}

export const main = middyfy(importFileParser);
