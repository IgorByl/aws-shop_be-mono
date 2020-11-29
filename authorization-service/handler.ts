//@ts-ignore //Promise<APIGatewayAuthorizerResult | void>
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
  Callback,
} from "aws-lambda";
import "source-map-support/register";

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context,
  callback: Callback<APIGatewayAuthorizerResult>
): void | Promise<APIGatewayAuthorizerResult> => {
  console.log("Lambda basicAuthorizer was called with event: ", event, context);

  if (event.type !== "TOKEN") {
    callback("Unauthorized");
  }

  try {
    const authorizationToken = event.authorizationToken;
    const buffer = Buffer.from(authorizationToken, "base64");
    const plainCreds = buffer.toString("utf-8").split(":");
    const [username, password] = plainCreds;

    console.log(
      `Lambda basicAuthorizer username: ${username}, password: ${password} from buffer.`
    );

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(authorizationToken, event.methodArn, effect);

    callback(null, policy);
  } catch (error) {
    callback(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (principalId, Resource, Effect = 'Allow') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource
      }
    ]
  }
});
