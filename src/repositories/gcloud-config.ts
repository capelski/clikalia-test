import { GatewayConfig, GatewayConfigRepository } from '../types';
import { Storage } from '@google-cloud/storage';

const paymentsConfigFile = 'payment-gateways.json';

const readFile = (bucketName: string, fileName: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        try {
            const storage = new Storage();
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(fileName);
            let content = '';
            blob.createReadStream()
                .on('data', (data) => (content += data))
                .on('end', () => resolve(content))
                .on('error', (e) => reject(e));
        } catch (error) {
            reject(error);
        }
    });
};

const writeFile = (bucketName: string, fileName: string, fileContents: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const storage = new Storage();
            const bucket = storage.bucket(bucketName);
            const blob = bucket.file(fileName);

            blob.createWriteStream().on('error', reject).on('finish', resolve).end(fileContents);
        } catch (error) {
            reject(error);
        }
    });
};

export const GcloudConfigRepository = (bucketName: string): GatewayConfigRepository => {
    const getAllPaymentGateways = () => {
        return readFile(bucketName, paymentsConfigFile).then(
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

                return writeFile(bucketName, paymentsConfigFile, JSON.stringify(updatedGateways));
            });
        }
    };
};
