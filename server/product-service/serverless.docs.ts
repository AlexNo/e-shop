export default {
    version: '0.0.1',
    title: 'My Bakery',
    description: 'This is API for bakery shop',
    models: [{
        name: 'ProductList',
        description: 'List of products response',
        contentType: 'application/json',
        schema: {
            definitions: {},
            title: 'ProductList',
            type: 'object',
            required: ['items', 'total'],
            properties: {
                items: {
                    title: 'List of products',
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                },
                total: {
                    title: 'Total',
                    type: 'integer'
                },
            },
        },
    }, {
        name: 'Product',
        description: 'Product response',
        contentType: 'application/json',
        schema: {
            definitions: {},
            title: 'Product',
            type: 'object',
            required: ['count', 'description', 'id', 'price', 'title'],
            properties: {
                count: {
                    title: 'Count',
                    type: 'integer'
                },
                description: {
                    title: 'Description',
                    type: 'string'
                },
                id: {
                    title: 'Id',
                    type: 'string'
                },
                price: {
                    title: 'Price',
                    type: 'integer'
                },
                title: {
                    title: 'Title',
                    type: 'string'
                }
            }
        },
    }, {
        name: 'Error',
        description: 'Error response',
        contentType: 'application/json',
        schema: {
            definitions: {},
            title: "Error",
            type: "object",
            default: null,
        },
    }],
};
