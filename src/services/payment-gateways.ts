import { Gateway } from '../types';

/* eslint-disable @typescript-eslint/no-var-requires */

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
