import {Client, QueryResult} from 'pg';
import {PublishCommand} from "@aws-sdk/client-sns";

import {sns} from '@libs/aws-clients';

const SELECT_ALL = 'SELECT id, title, price, count, description FROM products JOIN stocks ON id = product_id';
const SELECT_BY_ID = `SELECT id, title, count, description FROM products JOIN stocks ON id = product_id WHERE id = $1`;
const INSERT_PRODUCT = (p) => `INSERT INTO products(title, description, price)
        VALUES ('${p.title}', '${p.description}', ${p.price})
        RETURNING id`;
const INSERT_COUNT = (productId, count) => `INSERT INTO stocks(product_id, count) VALUES ('${productId}', ${count});`;

const {
    PG_HOST,
    PG_PORT,
    PG_DATABASE,
    PG_USERNAME,
    PG_PASSWORD,
} = process.env;
const dbOptions = {
    host: PG_HOST,
    port: +PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMills: 5000,
}

export class ProductService {
    private get client() {
        return new Client(dbOptions);
    }

    async getAll() {
        const {rows} = await this.select(SELECT_ALL);
        return rows;
    }

    async getByID(id) {
        const {rows} = await this.select(SELECT_BY_ID, [id]);
        return rows[0];
    }

    async create(product) {
        const dbClient = this.client;

        try {
            await dbClient.connect();
            await dbClient.query('BEGIN');

            console.log('[ProductService][create]', product)

            const {rows: [{ id }]} = await dbClient.query(INSERT_PRODUCT(product))
            await dbClient.query(INSERT_COUNT(id, product.count))

            await dbClient.query('COMMIT');

            const {rows: [result]} = await dbClient.query(SELECT_BY_ID, [id]);

            return result;
        } catch(err) {
            console.error('[Product Service] Database request error:', err);
            await dbClient.query('ROLLBACK');
            throw err;
        } finally {
            dbClient.end();
        }
    }

    private async select(sql: string, params?: any[]):Promise<QueryResult> {
        const dbClient = this.client;

        try {
            await dbClient.connect();
            return await dbClient.query(sql, params);
        } catch(err) {
            console.error('[Product Service:Select] Database request error:', err);
            throw err;
        } finally {
            dbClient.end();
        }
    }

    async handleProductsQueue(records) {
        const promises = records.map(async (record) => {
            console.log('[ProductService][handleProductsQueue]', record.body)
            const products = JSON.parse(record.body);

            for(const p of products) {
                await this.create(p);
            }

            const params = {
                Subject: `[Import] Added new products(${products.length})`,
                Message: record.body,
                TopicArn: process.env.SNS_ARN,
                MessageAttributes: {
                    count: {
                        DataType: 'Number',
                        StringValue: `${products.length}`
                    }
                }
            };

            await sns.send(new PublishCommand(params));
        });

        await Promise.all(promises);
    }
}
