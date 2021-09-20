import { Gateway, GatewayConfig } from '../types';
import { join } from 'path';
import { readFile } from 'fs';

/* eslint-disable @typescript-eslint/no-var-requires */

export const getActivePaymentGateways = (): Promise<GatewayConfig[]> => {
    return new Promise<GatewayConfig[]>((resolve, reject) => {
        const paymentsPath = join(__dirname, '..', '..', 'payment-gateways.json');

        readFile(paymentsPath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                const content = data.toString();
                const paymentGateways = JSON.parse(content) as GatewayConfig[];
                const activeGateways = paymentGateways.filter((x) => x.isActive);
                resolve(activeGateways);
            }
        });
    });
};

export const pay = (gatewayName: string): Promise<void> => {
    try {
        const {
            gateway
        }: {
            gateway: Gateway;
        } = require(`./${gatewayName}-gateway`);

        return gateway.pay({
            /*...*/
        });
    } catch (error) {
        return Promise.reject(`Error loading ${gatewayName} gateway`);
    }
};

export const reimburse = (gatewayName: string): Promise<void> => {
    try {
        const {
            gateway
        }: {
            gateway: Gateway;
        } = require(`./${gatewayName}-gateway`);

        return gateway.reimburse({
            /*...*/
        });
    } catch (error) {
        return Promise.reject(`Error loading ${gatewayName} gateway`);
    }
};
