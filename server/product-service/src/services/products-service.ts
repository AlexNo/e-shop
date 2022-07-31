import {Client, QueryResult} from 'pg';

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
    private db: Client;

    constructor() {
        this.db = new Client(dbOptions);
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
        try {
            await this.db.connect();
            await this.db.query('BEGIN');

            const {rows: [{ id }]} = await this.db.query(INSERT_PRODUCT(product))
            await this.db.query(INSERT_COUNT(id, product.count))

            await this.db.query('COMMIT');

            const {rows: [result]} = await this.db.query(SELECT_BY_ID, [id]);

            return result;
        } catch(err) {
            console.error('[Product Service] Database request error:', err);
            await this.db.query('ROLLBACK');
            throw err;
        } finally {
            this.db.end();
        }
    }

    private async select(sql: string, params?: any[]):Promise<QueryResult> {
        try {
            await this.db.connect();
            return await this.db.query(sql, params);
        } catch(err) {
            console.error('[Product Service:Select] Database request error:', err);
            throw err;
        } finally {
            this.db.end();
        }
    }
}
