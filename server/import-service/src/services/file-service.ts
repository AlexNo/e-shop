import {Readable} from 'stream';
import csv from 'csv-parser';
import {
    CopyObjectCommand,
    CopyObjectRequest,
    DeleteObjectCommand,
    DeleteObjectRequest,
} from '@aws-sdk/client-s3';

import {s3} from '@libs/aws-clients';

export class FileService {
    static async parseCSV(stream: Readable) {
        return await new Promise((resolve, reject) => {
            const chunks = [];
            stream
                .pipe(csv())
                .on('data', (chunk) => {
                    console.log('[FileService] parsing chunk:', chunk);
                    chunks.push(chunk);
                })
                .on('error', (error) => {
                    console.log('[FileService] parsing error', error);
                    reject(error);
                })
                .on('end', () => {
                    console.log('[FileService] csv parsed successfully');
                    resolve(chunks);
                });
        });
    }

    static async delete(bucket: { name: string }, object: { key: string }) {
        try {
            const params: DeleteObjectRequest = {
                Bucket: bucket.name,
                Key: object.key,
            };
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            console.log('[FileService] file deleted successfully');
        } catch (e) {
            console.log('[FileService] delete error', e);
        }
    }

    static async moveToParsed(bucket: { name: string }, object: { key: string }, ) {
        try {
            const params: CopyObjectRequest = {
                Bucket: bucket.name,
                CopySource: `${bucket.name}/${object.key}`,
                Key: object.key.replace(process.env.S3_UPLOADED_FOLDER, process.env.S3_PARSED_FOLDER),
            };

            const command = new CopyObjectCommand(params);
            return await s3.send(command);
        } catch (e) {
            console.log('[FileService] copy error', e);
        }
    }
}