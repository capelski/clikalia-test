import { Gateway } from '../types/gateway';

export const gateway: Gateway = {
    pay: () => {
        // This method must be implemented using paypal SDK or calling paypal API
        return Promise.resolve();
    },
    reimburse: () => {
        // This method must be implemented using paypal SDK or calling paypal API
        return Promise.resolve();
    }
};
