import {
    activePaymentGatewaysHandler,
    gatewayStatusHandler,
    payHandler,
    reimburseHandler
} from './controllers/payment-gateways';
import { GatewayConfigRepository } from './types';
import { GcloudConfigRepository } from './repositories/gcloud-config';
import { LocalConfigRepository } from './repositories/local-config';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;
const gatewayConfigRepository: GatewayConfigRepository =
    process.env.GCLOUD_STORAGE_BUCKET !== undefined
        ? GcloudConfigRepository(process.env.GCLOUD_STORAGE_BUCKET)
        : LocalConfigRepository();

app.get('/active-gateways', activePaymentGatewaysHandler(gatewayConfigRepository));

app.post('/pay', express.json(), payHandler(gatewayConfigRepository));

app.post('/reimburse', express.json(), reimburseHandler(gatewayConfigRepository));

app.put('/admin/gateway-status', express.json(), gatewayStatusHandler(gatewayConfigRepository));

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
