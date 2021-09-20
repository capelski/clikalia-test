import { getActivePaymentGateways, pay, reimburse } from '../services/payment-gateways';
import { RequestHandler } from 'express';

export const activePaymentGatewaysHandler: RequestHandler = (_req, res) => {
    return getActivePaymentGateways()
        .then((paymentGateways) => {
            return res.json(paymentGateways.map((x) => x.name));
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ message: "Couldn't retrieve active payment gateways" });
        });
};

export const payHandler: RequestHandler = (req, res) => {
    const { gatewayName } = req.body;

    if (!gatewayName) {
        return res.status(400).json({ message: 'Missing gateway name' });
    } else {
        return getActivePaymentGateways().then((activeGateways) => {
            const selectedGateway = activeGateways.find((g) => g.name === gatewayName);

            if (!selectedGateway) {
                return res.status(400).json({ message: 'Bad gateway name provided' });
            } else {
                return pay(selectedGateway.name)
                    .then(() => {
                        return res.send('Payment ok');
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            message: `An unexpected error ocurred while handling the payment with ${selectedGateway.name}`
                        });
                    });
            }
        });
    }
};

export const reimburseHandler: RequestHandler = (req, res) => {
    const { gatewayName } = req.body;

    if (!gatewayName) {
        return res.status(400).json({ message: 'Missing gateway name' });
    } else {
        return getActivePaymentGateways().then((activeGateways) => {
            const selectedGateway = activeGateways.find((g) => g.name === gatewayName);

            if (!selectedGateway) {
                return res.status(400).json({ message: 'Bad gateway name provided' });
            } else {
                return reimburse(selectedGateway.name)
                    .then(() => {
                        return res.send('Reimburse ok');
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({
                            message: `An unexpected error ocurred while handling the reimburse with ${selectedGateway.name}`
                        });
                    });
            }
        });
    }
};
