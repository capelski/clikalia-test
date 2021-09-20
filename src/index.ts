import {
    activePaymentGatewaysHandler,
    gatewayStatusHandler,
    payHandler,
    reimburseHandler
} from './controllers/payment-gateways';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/active-gateways', activePaymentGatewaysHandler);

app.post('/pay', express.json(), payHandler);

app.post('/reimburse', express.json(), reimburseHandler);

app.put('/admin/gateway-status', express.json(), gatewayStatusHandler);

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        info: {
            title: 'Clikalia backend',
            version: '1.0.0'
        },
        openapi: '3.0.0'
    },
    apis: ['./src/controllers/*.ts', './dist/controllers/*.js']
};

const openApiSpecification = swaggerJsdoc(swaggerOptions);

app.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpecification));

app.listen(PORT, () => {
    console.info(`Server up & running at port ${PORT}`);
});
