import { GatewayConfig, GatewayConfigRepository } from '../types';
import { readFile, writeFile } from 'fs';
import { join } from 'path';

const paymentsConfigPath = join(__dirname, '..', '..', 'payment-gateways.json');

const _readFile = (fileName: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        try {
            readFile(fileName, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.toString());
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

const _writeFile = (fileName: string, fileContents: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            writeFile(fileName, fileContents, (error) => {
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
};

export const LocalConfigRepository = (): GatewayConfigRepository => {
    const getAllPaymentGateways = () => {
        return _readFile(paymentsConfigPath).then(
            (content) => JSON.parse(content) as GatewayConfig[]
        );
    };

    return {
        getActivePaymentGateways: () => {
            return getAllPaymentGateways().then((gateways) => {
                return gateways.filter((x) => x.isActive);
            });
        },
        getAllPaymentGateways,
        updatePaymentGateway: (gatewayName: string, status: boolean) => {
            return getAllPaymentGateways().then((gateways) => {
                const updatedGateways = gateways.map((gateway) => {
                    return gateway.name === gatewayName
                        ? {
                              ...gateway,
                              isActive: status
                          }
                        : gateway;
                });

                return _writeFile(paymentsConfigPath, JSON.stringify(updatedGateways));
            });
        }
    };
};
