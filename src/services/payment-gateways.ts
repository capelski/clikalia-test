import { Gateway, GatewayConfig } from '../types';
import { readFile, writeFile } from 'fs';
import { join } from 'path';

/* eslint-disable @typescript-eslint/no-var-requires */

const paymentsConfigPath = join(__dirname, '..', '..', 'payment-gateways.json');

export const getAllPaymentGateways = (): Promise<GatewayConfig[]> => {
    return new Promise<GatewayConfig[]>((resolve, reject) => {
        try {
            readFile(paymentsConfigPath, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    const content = data.toString();
                    const paymentGateways = JSON.parse(content) as GatewayConfig[];
                    resolve(paymentGateways);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getActivePaymentGateways = (): Promise<GatewayConfig[]> => {
    return getAllPaymentGateways().then((gateways) => {
        return gateways.filter((x) => x.isActive);
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

export const updatePaymentGateways = (gatewayName: string, status: boolean): Promise<void> => {
    return getAllPaymentGateways().then((gateways) => {
        const updatedGateways = gateways.map((gateway) => {
            return gateway.name === gatewayName
                ? {
                      ...gateway,
                      isActive: status
                  }
                : gateway;
        });

        return new Promise((resolve, reject) => {
            try {
                writeFile(paymentsConfigPath, JSON.stringify(updatedGateways), (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    });
};
