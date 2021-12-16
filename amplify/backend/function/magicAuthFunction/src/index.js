/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["MAGIC_PUB_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/

const AWS = require("aws-sdk");
const { Magic } = require("@magic-sdk/admin");
const cognitoidentity = new AWS.CognitoIdentity({ apiVersion: "2014-06-30" });

const getSecret = async () => {
  return new AWS.SSM()
    .getParameters({
      Names: ["MAGIC_PUB_KEY"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();
};
exports.handler = async (event) => {
  const { Parameters } = await getSecret();
  const magic = new Magic(Parameters[0].Value);

  const { didToken, issuer } = JSON.parse(event.body);
  try {
    // Validate didToken sent from the client
    magic.token.validate(didToken);

    const param = {
      IdentityPoolId: process.env.IDENTITY_POOL_ID,
      Logins: {
        // The identifier name you set at Step 2
        [`com.magic.link`]: issuer,
      },
      TokenDuration: 3600, // same as expiration time of refresh time
    };

    // Retrieve OpenID Connect Token
    const result = await cognitoidentity
      .getOpenIdTokenForDeveloperIdentity(param)
      .promise();

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      },
      body: JSON.stringify(result),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: JSON.stringify(error.message),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods":
          "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      },
    };
    return response;
  }
};
