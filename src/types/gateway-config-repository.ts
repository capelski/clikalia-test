import { GatewayConfig } from './gateway-config';

export interface GatewayConfigRepository {
    getAllPaymentGateways: () => Promise<GatewayConfig[]>;
    getActivePaymentGateways: () => Promise<GatewayConfig[]>;
    updatePaymentGateway: (gatewayName: string, status: boolean) => Promise<void>;
}
