import {
    getActivePaymentGateways,
    getAllPaymentGateways,
    pay,
    reimburse,
    updatePaymentGateways
} from '../services/payment-gateways';
import { RequestHandler } from 'express';

/**
 * @openapi
 * /active-gateways:
 *      get:
 *          description: Returns a list of all active payment gateways name
 *          responses:
 *              200:
 *                  description: Active payment gateways name
 *              500:
 *                  description: Unexpected error retrieving the active payment gateways
 */
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

/**
 * @openapi
 * /pay:
 *      post:
 *          description: Process a payment with the provided payment gateway
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              gatewayName:
 *                                  type: string
 *                                  description: The name of the gateway to use for the payment
 *                                  example: stripe
 *          responses:
 *              200:
 *                  description: Successfully processed payment
 *              400:
 *                  description: Missing or incorrect gateway name
 *              500:
 *                  description: Unexpected error while handling payment
 */
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

/**
 * @openapi
 * /reimburse:
 *      post:
 *          description: Reimburse a payment with the provided payment gateway
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              gatewayName:
 *                                  type: string
 *                                  description: The name of the gateway to use for the reimburse
 *                                  example: stripe
 *          responses:
 *              200:
 *                  description: Successfully processed reimburse
 *              400:
 *                  description: Missing or incorrect gateway name
 *              500:
 *                  description: Unexpected error while handling reimburse
 */
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

/**
 * @openapi
 * /admin/gateway-status:
 *      put:
 *          description: Updates the specified payment gateway status
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              gatewayName:
 *                                  type: string
 *                                  description: The name of the gateway to be updated
 *                                  example: stripe
 *                              status:
 *                                  type: boolean
 *                                  description: New status of the payment gateway
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Successfully updated payment gateway
 *              400:
 *                  description: Missing or incorrect gateway name or gateway status
 *              500:
 *                  description: Unexpected error while updating payment gateway
 */
export const gatewayStatusHandler: RequestHandler = (req, res) => {
    const { gatewayName, status } = req.body;

    if (!gatewayName) {
        return res.status(400).json({ message: 'Missing gateway name' });
    } else if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Missing status' });
    } else {
        return getAllPaymentGateways()
            .then((paymentGateways) => {
                const selectedGateway = paymentGateways.find((g) => g.name === gatewayName);

                if (!selectedGateway) {
                    return res.status(400).json({ message: 'Bad gateway name provided' });
                } else {
                    return updatePaymentGateways(gatewayName, status).then(() => {
                        return res.send('Successfully updated payment gateway');
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({
                    message: `An unexpected error ocurred while updating ${gatewayName}`
                });
            });
    }
};
