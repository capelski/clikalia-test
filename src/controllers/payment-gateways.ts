import { RequestHandler } from 'express';
import { getActivePaymentGateways } from '../services/payment-gateways';

export const activePaymentGatewaysHandler: RequestHandler = (req, res, next) => {
    return getActivePaymentGateways()
        .then((paymentGateways) => {
            return res.json(paymentGateways.map((x) => x.name));
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ message: "Couldn't retrieve active payment gateways" });
        });
};
