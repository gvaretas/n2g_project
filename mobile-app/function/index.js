const AWS = require("aws-sdk");
const tableName = process.env.TABLE_NAME;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  console.log(event);
  const myArr = event.routeKey.split(' ');
  const routeKey = event.requestContext.http.method + ' ' + myArr[1];
  try {
    switch (routeKey) {
      case "DELETE /clients/{clientID}":
        await dynamo
          .delete({
            TableName: tableName,
            Key: {
              clientID: event.pathParameters.clientID
            }
          })
          .promise();
            body = `Deleted item ${event.pathParameters.clientID}`;
            break;
      case "GET /clients/{clientID}":
        body = await dynamo
          .get({
            TableName: tableName,
            Key: {
              clientID: event.pathParameters.clientID
            }
          })
          .promise();
        break;
    //   case "GET /items":
    //     body = await dynamo.scan({ TableName: "http-crud-tutorial-items" }).promise();
    //     break;
      case "PUT /clients/{clientID}":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: tableName,
            Item: {
              clientID: event.pathParameters.clientID,
              home: requestJSON.home,
              appliances: requestJSON.appliances,
              appliances_metadata: requestJSON.applianceMetadata
            }
          })
          .promise();
        body = `Put item ${event.pathParameters.clientID}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
