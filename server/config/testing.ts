import { IEnvConfig } from "../interfaces";

const config: IEnvConfig = {
    mongo: {
        uri: "mongodb://localhost",
        dbName: "identity-service-test",
    },
};

export default config;
