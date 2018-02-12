import { IEnvConfig } from "@interfaces";

const config: IEnvConfig = {
    port: process.env.PORT || 1416,
    mongo: {
        uri: "mongodb://localhost",
        dbName: "identity-service-test",
    },
    logglyToken: process.env.LOGGLY_TOKEN,
    logglySubdomain: process.env.LOGGLY_SUBDOMAIN,
};

export default config;
