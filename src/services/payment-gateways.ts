import { readFile } from 'fs';
import { join } from 'path';
import { PaymentGateway } from '../types';

export const getActivePaymentGateways = () => {
    return new Promise<PaymentGateway[]>((resolve, reject) => {
        const paymentsPath = join(__dirname, '..', '..', 'payment-gateways.json');

        readFile(paymentsPath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                const content = data.toString();
                const paymentGateways = JSON.parse(content) as PaymentGateway[];
                const activeGateways = paymentGateways.filter((x) => x.isActive);
                resolve(activeGateways);
            }
        });
    });
};
