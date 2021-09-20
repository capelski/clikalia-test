# Clickalia test

Payment gateway integration backend for Clikalia technical test

## Considerations

For each supported payment gateway a `xxx-gateway.ts` file is created implementing the methods defined by the `Gateway` interface. The name of the file (i.e. the `xxx` part) will then be used in the configuration file to dynamically enabling/disabling each payment gateway.

Before running the service the `payment-gateways.json` configuration file must be created in the root folder, listing the available payment gateways. This file can be updated at anytime without the need of restarting the service, and it is excluded from version control.

If a gateway is not listed in the `payment-gateways.json` it won't be available for payments/reimburses handling. If the gateway name is misspelled an error will occur when trying to use that gateway.
