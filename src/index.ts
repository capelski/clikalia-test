import express from 'express';
import { activePaymentGatewaysHandler } from './controllers/payment-gateways';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/active-gateways', activePaymentGatewaysHandler);

app.listen(PORT, () => {
    console.info(`Server up & running at port ${PORT}`);
});
