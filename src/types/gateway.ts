export type PaymentParameters = {
    // TBD
};

export type ReimburseParameters = {
    // TBD
};

export interface Gateway {
    pay: (parameters: PaymentParameters) => Promise<void>;
    reimburse: (parameters: ReimburseParameters) => Promise<void>;
}
