import { IConfig } from "./";

const config: IConfig = {
    port: process.env.PORT || 1416,
    mongo: {
        uri: "mongodb://localhost/identity-service-test",
    },
    // authRootUrl: process.env.AUTH_ROOT_URL || "http://identity-service.ro"
};

export default config;
