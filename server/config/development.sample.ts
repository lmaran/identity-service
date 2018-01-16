import { IEnvConfig } from "../interfaces";

const config: IEnvConfig = {
    port: process.env.PORT || 1420,
    mongo: {
        uri: "mongodb://localhost/identity-service-dev",
    },
    // authRootUrl: process.env.AUTH_ROOT_URL || "http://identity-service.ro"
};

export default config;
