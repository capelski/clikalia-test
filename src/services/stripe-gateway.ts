import { Gateway } from '../types/gateway';

export const gateway: Gateway = {
    pay: () => {
        // This method must be implemented using stripe SDK or calling stripe API
        return Promise.resolve();
    },
    reimburse: () => {
        // This method must be implemented using stripe SDK or calling stripe API
        return Promise.resolve();
    }
};
