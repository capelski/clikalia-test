import {
    activePaymentGatewaysHandler,
    payHandler,
    reimburseHandler
} from './controllers/payment-gateways';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/active-gateways', activePaymentGatewaysHandler);

app.post('/pay', express.json(), payHandler);

app.post('/reimburse', express.json(), reimburseHandler);

app.listen(PORT, () => {
    console.info(`Server up & running at port ${PORT}`);
});
