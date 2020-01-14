const environments = {};

environments.staging = {
  port: process.env.PORT ||3000,
  envName: "staging",
  hashingSecret: "this is a secret"
};

environments.production = {
  port: process.env.PORT ||5000,
  envName: "production",
  hashingSecret: "this is also a secret"
};

const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : "";

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
