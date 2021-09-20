# Clickalia test

Payment gateway integration backend for Clikalia technical test

## Set up

This repository contains a nodejs/typescript project. It can be launched by installing the npm dependencies and either starting the service in development mode (including hot reloading for typescript files) or building the service and starting it in production mode:

```bash
# Install dependencies
npm install
# Run in development mode
npm run dev
# Build and run in production mode
npm run build
npm start
```

Once the service is launched, an interactive swagger UI describing all the API methods can be accessed at http://localhost:3000/.

## Considerations

For each supported payment gateway a `xxx-gateway.ts` file is created implementing the methods defined by the `Gateway` interface. The name of the file (i.e. the `xxx` part) will then be used in the configuration repositories to dynamically enable/disable each payment gateway.

The configuration repositories are responsible for retrieving and updating the payment gateways configuration and they must implement the `GatewayConfigRepository` interface. There are currently two implementations:

-   **LocalConfigRepository**: Repository that uses a file named `payment-gateways.json` in the root folder of the project to store the gateways configuration. When using this repository, a file named `payment-gateways.json` must be created in the root folder, listing the available payment gateways (see `payment-gateways.template.json`).

    This file can be updated at anytime without the need of restarting the service and it is excluded from version control.

-   **GcloudConfigRepository**: Repository that uses a file named `payment-gateways.json` in a Google Cloud Storage bucket to store the gateways configuration. When using this repository a `env-variables.yaml` file must be created in the root folder, containing the name of the storage bucket (see `env-variables.template.yaml`). The app must then be deployed to Google App Engine environment within the same project of the storage bucket. Finally a file named `payment-gateways.json` must be created in the storage bucket, only for the first deployment, listing the available payment gateways (see `payment-gateways.template.json`).

    This file can be updated at anytime without the need of restarting the service.

If a payment gateway is not included in the selected gateway configuration repository, it's implementation won't be available for payments/reimburses handling. If the gateway name is misspelled an error will occur when trying to use that gateway.

Further repositories implementations can be added in the future by implementing the `GatewayConfigRepository` interface (e.g. a `MySqlConfigRepository` could be added in order to store config information in a my-sql database).
